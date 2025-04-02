from rest_framework import serializers
from .models import Faculty, Subject, Room, FacultyAssignment

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['employee_id', 'name', 'phone_no', 'email']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['subject_code', 'subject_name', 'department']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_no', 'branch', 'is_lab']

class FacultyAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyAssignment
        fields = ['employee_id', 'faculty_name', 'subject', 'branch']