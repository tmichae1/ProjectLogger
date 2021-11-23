from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('project/create-project/', views.create_project, name="create-project"),
    path('project/add-project-day/<project_id>/', views.create_project_day, name="create-project-day"),
    path('project/select-project-create/', views.select_project, name='select-project-create'),
    path('project/select-project-edit/', views.select_project, name='select-project-edit'),
    path('project/select-project-and-day/', views.select_project_and_day, name='select-project-and-day'),
    path('project/edit-project/<project_id>/', views.edit_project, name='edit_project'),
    path('project/edit/<project_id>/<project_day_id>/', views.edit_project_day, name='edit-project-day'),
    path("machine/add-machine/", views.add_machine, name="add-machine")
    
    
]
