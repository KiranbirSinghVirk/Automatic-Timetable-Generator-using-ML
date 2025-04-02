from django.db import models

class Faculty(models.Model):
    employee_id = models.CharField(max_length=10, unique=True, default='00000')
    name = models.CharField(max_length=100, default='Unknown')
    phone_no = models.CharField(max_length=15, default='0000000000')
    email = models.EmailField(unique=True, default='unknown@example.com')

    def __str__(self):
        return self.name

class Subject(models.Model):
    subject_code = models.CharField(max_length=10, unique=True, default='SUB000')
    subject_name = models.CharField(max_length=100, default='Unknown Subject')
    department = models.CharField(max_length=50, default='General')

    def __str__(self):
        return f"{self.subject_name} ({self.subject_code})"

class Room(models.Model):
    room_no = models.CharField(max_length=10, unique=True, default='R000')
    branch = models.CharField(max_length=50, default='General')
    is_lab = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.room_no} ({'Lab' if self.is_lab else 'Classroom'})"

class FacultyAssignment(models.Model):
    employee_id = models.ForeignKey(
        Faculty, 
        on_delete=models.CASCADE, 
        to_field='employee_id',
        default='00000'
    )
    faculty_name = models.CharField(max_length=100, default='Unknown Faculty')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    branch = models.CharField(max_length=50, default='General')

    def __str__(self):
        return f"{self.faculty_name} - {self.subject.subject_name} - {self.branch}"

    class Meta:
        unique_together = ('employee_id', 'subject', 'branch')

# from django.db import models

# class Faculty(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     def __str__(self): return self.name

# class Subject(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     is_lab = models.BooleanField(default=False)
#     def __str__(self): return self.name

# class Room(models.Model):
#     name = models.CharField(max_length=50, unique=True)
#     is_lab = models.BooleanField(default=False)
#     def __str__(self): return self.name

# class FacultyAssignment(models.Model):
#     faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     branch = models.CharField(max_length=50)
#     class Meta:
#         unique_together = ('faculty', 'subject', 'branch')
#     def __str__(self): return f"{self.faculty} - {self.subject} - {self.branch}"