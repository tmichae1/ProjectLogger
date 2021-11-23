from django.urls import path
from . import views

urlpatterns = [
    path('get-project-days/<project_id>/', views.get_project_days, name="get-project-days"),
    path('get-project-day-details/<project_day_id>/', views.get_project_day_details, name="get-project-day-details"),
    path('get-employee-names/', views.get_employees, name='get-employees'),
    path('get-machines/', views.get_machine_names, name='get-machines'),
    path('create-project-day/', views.add_project_day, name='add-project-day'),
    path('edit-project-day/', views.update_project_day, name="update-project_day")
]

