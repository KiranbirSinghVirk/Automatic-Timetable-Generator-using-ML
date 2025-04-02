import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import random
import json
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Faculty, Subject, Room, FacultyAssignment
from .serializers import FacultySerializer, SubjectSerializer, RoomSerializer, FacultyAssignmentSerializer

# Constants
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
SLOTS = ["9:35-10:20", "10:20-11:10", "11:10-12:00", "12:00-12:50", "1:35-2:20", "2:20-3:05", "3:05-3:50", "3:50-4:35"]
THEORY_SLOTS = 4
LAB_BLOCKS = 1
TOTAL_SLOTS = 40

# Load and train model at server startup
train_data = pd.read_csv("train_timetable.csv")
le_day = LabelEncoder().fit(DAYS)
le_slot = LabelEncoder().fit(SLOTS)
all_branches = train_data["Branch"].unique()
all_subjects = np.concatenate([train_data["Subject"].fillna("FREE").unique(), ["FREE"]])
all_faculty = train_data["Faculty"].fillna("").unique()
all_rooms = np.concatenate([train_data["Room"].fillna("").unique(), ["301", "302", "501", "502", "701", "702", "303", "304", "503", "305", "306", "504"]])
le_branch = LabelEncoder().fit(all_branches)
le_subject = LabelEncoder().fit(all_subjects)
le_faculty = LabelEncoder().fit(all_faculty)
le_room = LabelEncoder().fit(all_rooms)
le_type = LabelEncoder().fit(["Theory", "Lab", ""])

train_data["Day"] = le_day.transform(train_data["Day"])
train_data["Slot"] = le_slot.transform(train_data["Slot"])
train_data["Branch"] = le_branch.transform(train_data["Branch"])
train_data["Subject"] = le_subject.transform(train_data["Subject"].fillna("FREE"))
train_data["Faculty"] = le_faculty.transform(train_data["Faculty"].fillna(""))
train_data["Room"] = le_room.transform(train_data["Room"].fillna(""))
train_data["Type"] = le_type.transform(train_data["Type"].fillna(""))

X_train = train_data[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]]
y_train = train_data["Assigned"]
model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)
model.fit(X_train, y_train)
print("Model trained successfully at startup")

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class FacultyAssignmentViewSet(viewsets.ModelViewSet):
    queryset = FacultyAssignment.objects.all()
    serializer_class = FacultyAssignmentSerializer

@api_view(['POST'])
def generate_timetable(request):
    department = request.data.get('department')
    if not department:
        return Response({"error": "Department required"}, status=400)

    # Generate load_sheet from FacultyAssignment for the selected department
    assignments = FacultyAssignment.objects.filter(subject__department=department)
    load_sheet_data = {
        "Faculty": [a.faculty_name for a in assignments],
        "Subject": [a.subject.subject_name for a in assignments],
        "Branch": [a.branch for a in assignments]
    }
    load_sheet = pd.DataFrame(load_sheet_data)

    branches = load_sheet["Branch"].unique()
    classrooms = {r.branch: r.room_no for r in Room.objects.filter(is_lab=False, branch__in=branches)}

    # Update encoders with new data
    new_branches = np.unique(np.concatenate([all_branches, branches]))
    new_subjects = np.unique(np.concatenate([all_subjects, load_sheet["Subject"].unique()]))
    new_faculty = np.unique(np.concatenate([all_faculty, load_sheet["Faculty"].unique()]))
    le_branch.classes_ = new_branches
    le_subject.classes_ = new_subjects
    le_faculty.classes_ = new_faculty

    # Parse subjects and faculty
    subject_info = {}
    for branch in branches:
        branch_data = load_sheet[load_sheet["Branch"] == branch]
        subject_info[branch] = {"Theory": {}, "Lab": {}}
        for _, row in branch_data.iterrows():
            subject = row["Subject"]
            faculty = row["Faculty"]
            if "LAB" in subject.upper():
                base_subject = subject.replace(" LAB", "").strip()
                subject_info[branch]["Lab"][base_subject] = faculty
            else:
                subject_info[branch]["Theory"][subject] = faculty

    # Generate prediction data
    pred_data = []
    lab_rooms = [r.room_no for r in Room.objects.filter(is_lab=True)]
    for branch in branches:
        lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
        for day in DAYS:
            for slot in SLOTS:
                for subject, faculty in subject_info[branch]["Theory"].items():
                    pred_data.append([day, slot, branch, subject, faculty, classrooms.get(branch, "Unknown"), "Theory"])
                for subject, faculty in subject_info[branch]["Lab"].items():
                    pred_data.append([day, slot, branch, f"{subject} LAB", faculty, lab_room, "Lab"])
                pred_data.append([day, slot, branch, "FREE", "", classrooms.get(branch, "Unknown"), ""])

    pred_df = pd.DataFrame(pred_data, columns=["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"])
    pred_df["Day"] = le_day.transform(pred_df["Day"])
    pred_df["Slot"] = le_slot.transform(pred_df["Slot"])
    pred_df["Branch"] = le_branch.transform(pred_df["Branch"])
    pred_df["Subject"] = le_subject.transform(pred_df["Subject"])
    pred_df["Faculty"] = le_faculty.transform(pred_df["Faculty"])
    pred_df["Room"] = le_room.transform(pred_df["Room"])
    pred_df["Type"] = le_type.transform(pred_df["Type"])

    predictions = model.predict(pred_df[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]])
    pred_df["Assigned"] = predictions

    # Decode
    pred_df["Day"] = le_day.inverse_transform(pred_df["Day"])
    pred_df["Slot"] = le_slot.inverse_transform(pred_df["Slot"])
    pred_df["Branch"] = le_branch.inverse_transform(pred_df["Branch"])
    pred_df["Subject"] = le_subject.inverse_transform(pred_df["Subject"])
    pred_df["Faculty"] = le_faculty.inverse_transform(pred_df["Faculty"])
    pred_df["Room"] = le_room.inverse_transform(pred_df["Room"])
    pred_df["Type"] = le_type.inverse_transform(pred_df["Type"])

    # Post-process with constraints
    final_timetable = []
    all_slots = [(day, slot) for day in DAYS for slot in SLOTS]
    global_used_slots = {}

    for branch in branches:
        branch_preds = pred_df[pred_df["Branch"] == branch].copy()
        theory_subjects = list(subject_info[branch]["Theory"].keys())
        lab_subjects = list(subject_info[branch]["Lab"].keys())
        lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
        used_slots = set()

        # Lab assignments
        lab_pairs = [(day, SLOTS[i], SLOTS[i+1]) for day in DAYS for i in range(len(SLOTS)-1) if i % 2 == 0]
        random.shuffle(lab_pairs)
        lab_counts = {s: 0 for s in lab_subjects}
        for subject in lab_subjects:
            for day, slot1, slot2 in lab_pairs:
                if lab_counts[subject] >= LAB_BLOCKS:
                    break
                faculty = subject_info[branch]["Lab"][subject]
                slot1_key = (day, slot1)
                slot2_key = (day, slot2)
                slot1_conflict = slot1_key in global_used_slots and global_used_slots[slot1_key] == faculty
                slot2_conflict = slot2_key in global_used_slots and global_used_slots[slot2_key] == faculty
                if not (slot1_key in used_slots or slot2_key in used_slots or slot1_conflict or slot2_conflict):
                    final_timetable.extend([
                        {"Day": day, "Slot": slot1, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"},
                        {"Day": day, "Slot": slot2, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"}
                    ])
                    used_slots.add(slot1_key)
                    used_slots.add(slot2_key)
                    global_used_slots[slot1_key] = faculty
                    global_used_slots[slot2_key] = faculty
                    lab_counts[subject] += 1
                    break

        # Theory assignments
        remaining_slots = [s for s in all_slots if s not in used_slots]
        random.shuffle(remaining_slots)
        for subject in theory_subjects:
            assigned_slots = 0
            faculty = subject_info[branch]["Theory"][subject]
            slots_to_assign = remaining_slots[:]
            random.shuffle(slots_to_assign)
            for day, slot in slots_to_assign:
                if assigned_slots >= THEORY_SLOTS:
                    break
                slot_key = (day, slot)
                conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
                if not conflict and slot_key not in used_slots:
                    pred = branch_preds[(branch_preds["Day"] == day) & (branch_preds["Slot"] == slot) & (branch_preds["Subject"] == subject) & (branch_preds["Type"] == "Theory")]
                    if not pred.empty and pred["Assigned"].iloc[0] == 1:
                        final_timetable.append({
                            "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
                        })
                        used_slots.add(slot_key)
                        global_used_slots[slot_key] = faculty
                        assigned_slots += 1
                        remaining_slots.remove(slot_key)
            while assigned_slots < THEORY_SLOTS and remaining_slots:
                day, slot = remaining_slots.pop(0)
                slot_key = (day, slot)
                if slot_key not in used_slots:
                    conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
                    if not conflict:
                        final_timetable.append({
                            "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
                        })
                        used_slots.add(slot_key)
                        global_used_slots[slot_key] = faculty
                        assigned_slots += 1

        # Fill with FREE slots
        total_assigned = len([entry for entry in final_timetable if entry["Branch"] == branch])
        free_slots_needed = TOTAL_SLOTS - total_assigned
        for day, slot in all_slots:
            if free_slots_needed <= 0:
                break
            slot_key = (day, slot)
            if slot_key not in used_slots:
                final_timetable.append({
                    "Day": day, "Slot": slot, "Branch": branch, "Subject": "FREE", "Faculty": "", "Room": classrooms.get(branch, "Unknown"), "Type": ""
                })
                used_slots.add(slot_key)
                free_slots_needed -= 1

    return Response(final_timetable)

# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import LabelEncoder
# import random
# import json
# from rest_framework import viewsets
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Faculty, Subject, Room, FacultyAssignment
# from .serializers import FacultySerializer, SubjectSerializer, RoomSerializer, FacultyAssignmentSerializer

# # Constants
# DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
# SLOTS = ["9:35-10:20", "10:20-11:10", "11:10-12:00", "12:00-12:50", "1:35-2:20", "2:20-3:05", "3:05-3:50", "3:50-4:35"]
# THEORY_SLOTS = 4
# LAB_BLOCKS = 1
# TOTAL_SLOTS = 40  # 5 days * 8 slots/day

# # Load and train model at server startup
# train_data = pd.read_csv("train_timetable.csv")
# le_day = LabelEncoder().fit(DAYS)
# le_slot = LabelEncoder().fit(SLOTS)
# all_branches = train_data["Branch"].unique()
# all_subjects = np.concatenate([train_data["Subject"].fillna("FREE").unique(), ["FREE"]])
# all_faculty = train_data["Faculty"].fillna("").unique()
# all_rooms = np.concatenate([train_data["Room"].fillna("").unique(), ["301", "302", "501", "502", "701", "702", "303", "304", "503", "305", "306", "504"]])
# le_branch = LabelEncoder().fit(all_branches)
# le_subject = LabelEncoder().fit(all_subjects)
# le_faculty = LabelEncoder().fit(all_faculty)
# le_room = LabelEncoder().fit(all_rooms)
# le_type = LabelEncoder().fit(["Theory", "Lab", ""])

# train_data["Day"] = le_day.transform(train_data["Day"])
# train_data["Slot"] = le_slot.transform(train_data["Slot"])
# train_data["Branch"] = le_branch.transform(train_data["Branch"])
# train_data["Subject"] = le_subject.transform(train_data["Subject"].fillna("FREE"))
# train_data["Faculty"] = le_faculty.transform(train_data["Faculty"].fillna(""))
# train_data["Room"] = le_room.transform(train_data["Room"].fillna(""))
# train_data["Type"] = le_type.transform(train_data["Type"].fillna(""))

# X_train = train_data[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]]
# y_train = train_data["Assigned"]
# model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)
# model.fit(X_train, y_train)
# print("Model trained successfully at startup")

# class FacultyViewSet(viewsets.ModelViewSet):
#     queryset = Faculty.objects.all()
#     serializer_class = FacultySerializer

# class SubjectViewSet(viewsets.ModelViewSet):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer

# class RoomViewSet(viewsets.ModelViewSet):
#     queryset = Room.objects.all()
#     serializer_class = RoomSerializer

# class FacultyAssignmentViewSet(viewsets.ModelViewSet):
#     queryset = FacultyAssignment.objects.all()
#     serializer_class = FacultyAssignmentSerializer

# @api_view(['POST'])
# def generate_timetable(request):
#     load_file = request.FILES.get('load_sheet')
#     if not load_file:
#         return Response({"error": "Load sheet required"}, status=400)
    
#     load_sheet = pd.read_csv(load_file)
#     branches = load_sheet["Branch"].unique()
#     classrooms_raw = request.data.get('classrooms', '{}')
#     try:
#         classrooms = json.loads(classrooms_raw)
#     except json.JSONDecodeError:
#         return Response({"error": "Invalid classrooms JSON format"}, status=400)

#     # Update encoders with new data
#     new_branches = np.unique(np.concatenate([all_branches, branches]))
#     new_subjects = np.unique(np.concatenate([all_subjects, load_sheet["Subject"].unique()]))
#     new_faculty = np.unique(np.concatenate([all_faculty, load_sheet["Faculty"].unique()]))
#     le_branch.classes_ = new_branches
#     le_subject.classes_ = new_subjects
#     le_faculty.classes_ = new_faculty

#     # Parse subjects and faculty
#     subject_info = {}
#     for branch in branches:
#         branch_data = load_sheet[load_sheet["Branch"] == branch]
#         subject_info[branch] = {"Theory": {}, "Lab": {}}
#         for _, row in branch_data.iterrows():
#             subject = row["Subject"]
#             faculty = row["Faculty"]
#             if "LAB" in subject.upper():
#                 base_subject = subject.replace(" LAB", "").strip()
#                 subject_info[branch]["Lab"][base_subject] = faculty
#             else:
#                 subject_info[branch]["Theory"][subject] = faculty

#     # Generate prediction data
#     pred_data = []
#     lab_rooms = [r.name for r in Room.objects.filter(is_lab=True)]
#     for branch in branches:
#         lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
#         for day in DAYS:
#             for slot in SLOTS:
#                 for subject, faculty in subject_info[branch]["Theory"].items():
#                     pred_data.append([day, slot, branch, subject, faculty, classrooms.get(branch, "Unknown"), "Theory"])
#                 for subject, faculty in subject_info[branch]["Lab"].items():
#                     pred_data.append([day, slot, branch, f"{subject} LAB", faculty, lab_room, "Lab"])
#                 pred_data.append([day, slot, branch, "FREE", "", classrooms.get(branch, "Unknown"), ""])

#     pred_df = pd.DataFrame(pred_data, columns=["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"])
#     pred_df["Day"] = le_day.transform(pred_df["Day"])
#     pred_df["Slot"] = le_slot.transform(pred_df["Slot"])
#     pred_df["Branch"] = le_branch.transform(pred_df["Branch"])
#     pred_df["Subject"] = le_subject.transform(pred_df["Subject"])
#     pred_df["Faculty"] = le_faculty.transform(pred_df["Faculty"])
#     pred_df["Room"] = le_room.transform(pred_df["Room"])
#     pred_df["Type"] = le_type.transform(pred_df["Type"])

#     predictions = model.predict(pred_df[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]])
#     pred_df["Assigned"] = predictions

#     # Decode
#     pred_df["Day"] = le_day.inverse_transform(pred_df["Day"])
#     pred_df["Slot"] = le_slot.inverse_transform(pred_df["Slot"])
#     pred_df["Branch"] = le_branch.inverse_transform(pred_df["Branch"])
#     pred_df["Subject"] = le_subject.inverse_transform(pred_df["Subject"])
#     pred_df["Faculty"] = le_faculty.inverse_transform(pred_df["Faculty"])
#     pred_df["Room"] = le_room.inverse_transform(pred_df["Room"])
#     pred_df["Type"] = le_type.inverse_transform(pred_df["Type"])

#     # Post-process with constraints
#     final_timetable = []
#     all_slots = [(day, slot) for day in DAYS for slot in SLOTS]
#     global_used_slots = {}  # Tracks (day, slot) -> faculty to prevent overlaps

#     for branch in branches:
#         branch_preds = pred_df[pred_df["Branch"] == branch].copy()
#         theory_subjects = list(subject_info[branch]["Theory"].keys())
#         lab_subjects = list(subject_info[branch]["Lab"].keys())
#         lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
#         used_slots = set()

#         # Lab assignments (2 consecutive slots)
#         lab_pairs = [(day, SLOTS[i], SLOTS[i+1]) for day in DAYS for i in range(len(SLOTS)-1) if i % 2 == 0]
#         random.shuffle(lab_pairs)
#         lab_counts = {s: 0 for s in lab_subjects}
#         for subject in lab_subjects:
#             for day, slot1, slot2 in lab_pairs:
#                 if lab_counts[subject] >= LAB_BLOCKS:
#                     break
#                 faculty = subject_info[branch]["Lab"][subject]
#                 slot1_key = (day, slot1)
#                 slot2_key = (day, slot2)
#                 slot1_conflict = slot1_key in global_used_slots and global_used_slots[slot1_key] == faculty
#                 slot2_conflict = slot2_key in global_used_slots and global_used_slots[slot2_key] == faculty
#                 if not (slot1_key in used_slots or slot2_key in used_slots or slot1_conflict or slot2_conflict):
#                     final_timetable.extend([
#                         {"Day": day, "Slot": slot1, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"},
#                         {"Day": day, "Slot": slot2, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"}
#                     ])
#                     used_slots.add(slot1_key)
#                     used_slots.add(slot2_key)
#                     global_used_slots[slot1_key] = faculty
#                     global_used_slots[slot2_key] = faculty
#                     lab_counts[subject] += 1
#                     break

#         # Theory assignments (4 slots per subject)
#         remaining_slots = [s for s in all_slots if s not in used_slots]
#         random.shuffle(remaining_slots)
#         for subject in theory_subjects:
#             assigned_slots = 0
#             faculty = subject_info[branch]["Theory"][subject]
#             slots_to_assign = remaining_slots[:]
#             random.shuffle(slots_to_assign)
#             for day, slot in slots_to_assign:
#                 if assigned_slots >= THEORY_SLOTS:
#                     break
#                 slot_key = (day, slot)
#                 conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
#                 if not conflict and slot_key not in used_slots:
#                     pred = branch_preds[(branch_preds["Day"] == day) & (branch_preds["Slot"] == slot) & (branch_preds["Subject"] == subject) & (branch_preds["Type"] == "Theory")]
#                     if not pred.empty and pred["Assigned"].iloc[0] == 1:
#                         final_timetable.append({
#                             "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
#                         })
#                         used_slots.add(slot_key)
#                         global_used_slots[slot_key] = faculty
#                         assigned_slots += 1
#                         remaining_slots.remove(slot_key)
#             # Force remaining slots if needed
#             while assigned_slots < THEORY_SLOTS and remaining_slots:
#                 day, slot = remaining_slots.pop(0)
#                 slot_key = (day, slot)
#                 if slot_key not in used_slots:
#                     conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
#                     if not conflict:
#                         final_timetable.append({
#                             "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
#                         })
#                         used_slots.add(slot_key)
#                         global_used_slots[slot_key] = faculty
#                         assigned_slots += 1

#         # Fill remaining slots with FREE to ensure 40 total slots
#         total_assigned = len([entry for entry in final_timetable if entry["Branch"] == branch])
#         free_slots_needed = TOTAL_SLOTS - total_assigned
#         for day, slot in all_slots:
#             if free_slots_needed <= 0:
#                 break
#             slot_key = (day, slot)
#             if slot_key not in used_slots:
#                 final_timetable.append({
#                     "Day": day, "Slot": slot, "Branch": branch, "Subject": "FREE", "Faculty": "", "Room": classrooms.get(branch, "Unknown"), "Type": ""
#                 })
#                 used_slots.add(slot_key)
#                 free_slots_needed -= 1

#     # Verify total slots per branch
#     for branch in branches:
#         branch_slots = len([entry for entry in final_timetable if entry["Branch"] == branch])
#         if branch_slots != TOTAL_SLOTS:
#             print(f"Warning: {branch} has {branch_slots} slots instead of {TOTAL_SLOTS}")

#     return Response(final_timetable)

# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import LabelEncoder
# import random
# import json  # Add this import
# from rest_framework import viewsets
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Faculty, Subject, Room, FacultyAssignment
# from .serializers import FacultySerializer, SubjectSerializer, RoomSerializer, FacultyAssignmentSerializer

# # Constants
# DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
# SLOTS = ["9:35-10:20", "10:20-11:10", "11:10-12:00", "12:00-12:50", "1:35-2:20", "2:20-3:05", "3:05-3:50", "3:50-4:35"]
# THEORY_SLOTS = 4
# LAB_BLOCKS = 1

# # Load and train model at server startup
# train_data = pd.read_csv("train_timetable.csv")
# le_day = LabelEncoder().fit(DAYS)
# le_slot = LabelEncoder().fit(SLOTS)
# all_branches = train_data["Branch"].unique()
# all_subjects = np.concatenate([train_data["Subject"].fillna("FREE").unique(), ["FREE"]])
# all_faculty = train_data["Faculty"].fillna("").unique()
# all_rooms = np.concatenate([train_data["Room"].fillna("").unique(), ["301", "302", "501", "502", "701", "702", "303", "304", "503", "305", "306", "504"]])
# le_branch = LabelEncoder().fit(all_branches)
# le_subject = LabelEncoder().fit(all_subjects)
# le_faculty = LabelEncoder().fit(all_faculty)
# le_room = LabelEncoder().fit(all_rooms)
# le_type = LabelEncoder().fit(["Theory", "Lab", ""])

# train_data["Day"] = le_day.transform(train_data["Day"])
# train_data["Slot"] = le_slot.transform(train_data["Slot"])
# train_data["Branch"] = le_branch.transform(train_data["Branch"])
# train_data["Subject"] = le_subject.transform(train_data["Subject"].fillna("FREE"))
# train_data["Faculty"] = le_faculty.transform(train_data["Faculty"].fillna(""))
# train_data["Room"] = le_room.transform(train_data["Room"].fillna(""))
# train_data["Type"] = le_type.transform(train_data["Type"].fillna(""))

# X_train = train_data[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]]
# y_train = train_data["Assigned"]
# model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)
# model.fit(X_train, y_train)
# print("Model trained successfully at startup")

# class FacultyViewSet(viewsets.ModelViewSet):
#     queryset = Faculty.objects.all()
#     serializer_class = FacultySerializer

# class SubjectViewSet(viewsets.ModelViewSet):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer

# class RoomViewSet(viewsets.ModelViewSet):
#     queryset = Room.objects.all()
#     serializer_class = RoomSerializer

# class FacultyAssignmentViewSet(viewsets.ModelViewSet):
#     queryset = FacultyAssignment.objects.all()
#     serializer_class = FacultyAssignmentSerializer

# @api_view(['POST'])
# def generate_timetable(request):
#     load_file = request.FILES.get('load_sheet')
#     if not load_file:
#         return Response({"error": "Load sheet required"}, status=400)
    
#     load_sheet = pd.read_csv(load_file)
#     branches = load_sheet["Branch"].unique()
#     classrooms_raw = request.data.get('classrooms', '{}')  # Get as string, default to empty JSON
#     try:
#         classrooms = json.loads(classrooms_raw)  # Parse JSON string to dictionary
#     except json.JSONDecodeError:
#         return Response({"error": "Invalid classrooms JSON format"}, status=400)

#     # Update encoders with new data
#     new_branches = np.unique(np.concatenate([all_branches, branches]))
#     new_subjects = np.unique(np.concatenate([all_subjects, load_sheet["Subject"].unique()]))
#     new_faculty = np.unique(np.concatenate([all_faculty, load_sheet["Faculty"].unique()]))
#     le_branch.classes_ = new_branches
#     le_subject.classes_ = new_subjects
#     le_faculty.classes_ = new_faculty

#     # Parse subjects and faculty
#     subject_info = {}
#     for branch in branches:
#         branch_data = load_sheet[load_sheet["Branch"] == branch]
#         subject_info[branch] = {"Theory": {}, "Lab": {}}
#         for _, row in branch_data.iterrows():
#             subject = row["Subject"]
#             faculty = row["Faculty"]
#             if "LAB" in subject.upper():
#                 base_subject = subject.replace(" LAB", "").strip()
#                 subject_info[branch]["Lab"][base_subject] = faculty
#             else:
#                 subject_info[branch]["Theory"][subject] = faculty

#     # Generate prediction data
#     pred_data = []
#     lab_rooms = [r.name for r in Room.objects.filter(is_lab=True)]
#     for branch in branches:
#         lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
#         for day in DAYS:
#             for slot in SLOTS:
#                 for subject, faculty in subject_info[branch]["Theory"].items():
#                     pred_data.append([day, slot, branch, subject, faculty, classrooms.get(branch, "Unknown"), "Theory"])
#                 for subject, faculty in subject_info[branch]["Lab"].items():
#                     pred_data.append([day, slot, branch, f"{subject} LAB", faculty, lab_room, "Lab"])
#                 pred_data.append([day, slot, branch, "FREE", "", classrooms.get(branch, "Unknown"), ""])

#     pred_df = pd.DataFrame(pred_data, columns=["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"])
#     pred_df["Day"] = le_day.transform(pred_df["Day"])
#     pred_df["Slot"] = le_slot.transform(pred_df["Slot"])
#     pred_df["Branch"] = le_branch.transform(pred_df["Branch"])
#     pred_df["Subject"] = le_subject.transform(pred_df["Subject"])
#     pred_df["Faculty"] = le_faculty.transform(pred_df["Faculty"])
#     pred_df["Room"] = le_room.transform(pred_df["Room"])
#     pred_df["Type"] = le_type.transform(pred_df["Type"])

#     predictions = model.predict(pred_df[["Day", "Slot", "Branch", "Subject", "Faculty", "Room", "Type"]])
#     pred_df["Assigned"] = predictions

#     # Decode
#     pred_df["Day"] = le_day.inverse_transform(pred_df["Day"])
#     pred_df["Slot"] = le_slot.inverse_transform(pred_df["Slot"])
#     pred_df["Branch"] = le_branch.inverse_transform(pred_df["Branch"])
#     pred_df["Subject"] = le_subject.inverse_transform(pred_df["Subject"])
#     pred_df["Faculty"] = le_faculty.inverse_transform(pred_df["Faculty"])
#     pred_df["Room"] = le_room.inverse_transform(pred_df["Room"])
#     pred_df["Type"] = le_type.inverse_transform(pred_df["Type"])

#     # Post-process with constraints
#     final_timetable = []
#     all_slots = [(day, slot) for day in DAYS for slot in SLOTS]
#     global_used_slots = {}

#     for branch in branches:
#         branch_preds = pred_df[pred_df["Branch"] == branch].copy()
#         theory_subjects = list(subject_info[branch]["Theory"].keys())
#         lab_subjects = list(subject_info[branch]["Lab"].keys())
#         lab_room = lab_rooms[branches.tolist().index(branch) % len(lab_rooms)]
#         used_slots = set()

#         # Lab assignments
#         lab_pairs = [(day, SLOTS[i], SLOTS[i+1]) for day in DAYS for i in range(len(SLOTS)-1) if i % 2 == 0]
#         random.shuffle(lab_pairs)
#         lab_counts = {s: 0 for s in lab_subjects}
#         for subject in lab_subjects:
#             for day, slot1, slot2 in lab_pairs:
#                 if lab_counts[subject] >= LAB_BLOCKS:
#                     break
#                 faculty = subject_info[branch]["Lab"][subject]
#                 slot1_key = (day, slot1)
#                 slot2_key = (day, slot2)
#                 slot1_conflict = slot1_key in global_used_slots and global_used_slots[slot1_key] == faculty
#                 slot2_conflict = slot2_key in global_used_slots and global_used_slots[slot2_key] == faculty
#                 if not (slot1_key in used_slots or slot2_key in used_slots or slot1_conflict or slot2_conflict):
#                     final_timetable.extend([
#                         {"Day": day, "Slot": slot1, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"},
#                         {"Day": day, "Slot": slot2, "Branch": branch, "Subject": f"{subject} LAB", "Faculty": faculty, "Room": lab_room, "Type": "Lab"}
#                     ])
#                     used_slots.add(slot1_key)
#                     used_slots.add(slot2_key)
#                     global_used_slots[slot1_key] = faculty
#                     global_used_slots[slot2_key] = faculty
#                     lab_counts[subject] += 1
#                     break

#         # Theory assignments
#         remaining_slots = [s for s in all_slots if s not in used_slots]
#         random.shuffle(remaining_slots)
#         for subject in theory_subjects:
#             assigned_slots = 0
#             faculty = subject_info[branch]["Theory"][subject]
#             slots_to_assign = remaining_slots[:]
#             random.shuffle(slots_to_assign)
#             for day, slot in slots_to_assign:
#                 if assigned_slots >= THEORY_SLOTS:
#                     break
#                 slot_key = (day, slot)
#                 conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
#                 if not conflict and slot_key not in used_slots:
#                     pred = branch_preds[(branch_preds["Day"] == day) & (branch_preds["Slot"] == slot) & (branch_preds["Subject"] == subject) & (branch_preds["Type"] == "Theory")]
#                     if not pred.empty and pred["Assigned"].iloc[0] == 1:
#                         final_timetable.append({
#                             "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
#                         })
#                         used_slots.add(slot_key)
#                         global_used_slots[slot_key] = faculty
#                         assigned_slots += 1
#                         remaining_slots.remove(slot_key)
#             while assigned_slots < THEORY_SLOTS and remaining_slots:
#                 day, slot = remaining_slots.pop(0)
#                 slot_key = (day, slot)
#                 if slot_key not in used_slots:
#                     conflict = slot_key in global_used_slots and global_used_slots[slot_key] == faculty
#                     if not conflict:
#                         final_timetable.append({
#                             "Day": day, "Slot": slot, "Branch": branch, "Subject": subject, "Faculty": faculty, "Room": classrooms.get(branch, "Unknown"), "Type": "Theory"
#                         })
#                         used_slots.add(slot_key)
#                         global_used_slots[slot_key] = faculty
#                         assigned_slots += 1

#         # Free slots
#         free_count = 0
#         for day, slot in all_slots:
#             slot_key = (day, slot)
#             if slot_key not in used_slots and free_count < 8:
#                 final_timetable.append({"Day": day, "Slot": slot, "Branch": branch, "Subject": "FREE", "Faculty": "", "Room": classrooms.get(branch, "Unknown"), "Type": ""})
#                 used_slots.add(slot_key)
#                 free_count += 1

#     return Response(final_timetable)