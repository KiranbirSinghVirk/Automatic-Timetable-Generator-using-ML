from django.contrib import admin
from .models import Faculty, Subject, Room, FacultyAssignment

# Register your models here
@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'name', 'phone_no', 'email')
    search_fields = ('employee_id', 'name', 'email')
    ordering = ('name',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject_code', 'subject_name', 'department')
    search_fields = ('subject_code', 'subject_name')
    list_filter = ('department',)
    ordering = ('subject_code',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_no', 'branch', 'is_lab')
    search_fields = ('room_no', 'branch')
    list_filter = ('is_lab', 'branch')
    ordering = ('room_no',)

@admin.register(FacultyAssignment)
class FacultyAssignmentAdmin(admin.ModelAdmin):
    list_display = ('faculty_name', 'employee_id', 'subject', 'branch')
    search_fields = ('faculty_name', 'employee_id__employee_id', 'subject__subject_name')
    list_filter = ('branch',)
    ordering = ('faculty_name',)
    
    # This helps with performance when dealing with foreign keys
    autocomplete_fields = ['employee_id', 'subject']