from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'faculty', views.FacultyViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'rooms', views.RoomViewSet)
router.register(r'assignments', views.FacultyAssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', views.generate_timetable, name='generate_timetable'),
]