from re import template
from django.shortcuts import get_object_or_404, redirect, render
from django.core import serializers
from django.contrib.auth.decorators import login_required
from .models import Project, ProjectDay, Employee, EmployeePrice, MaterialsAndSundries, Machine
from .forms import CreateMachineForm, CreateProjectForm, CreateProjectDayForm
from django.utils.safestring import mark_safe
from django.contrib import messages
from .functions import generate_random_id

# Create your views here.
@login_required
def dashboard(request):
    template_name = "report/dashboard.html"
    projects = Project.objects.order_by("created")

    # Check if there are any machines
    if len(Machine.objects.all()) == 0:
        messages.warning(request, mark_safe("No machines have been added yet. Add them <a href='machine/add-machine/'><strong>HERE</strong></a>"))
    context = {"projects" : projects}
    return render(request, template_name, context)

@login_required
def create_project(request):
    template_name = "report/create_project.html"
    if request.method =='POST':
        form = CreateProjectForm(request.POST)

        if form.is_valid():
            # Generate 15 dig alphanumeric string for id
            project_id = generate_random_id(15)
            form.instance.project_id = project_id
            form.save()

            # Determin Which sumbit button was pressed and redierct
            if "save_quit" in request.POST:
                return redirect("dashboard")
            if "save_add" in request.POST:
                return redirect("create-project-day", project_id=project_id)
    else:
        form = CreateProjectForm()
    context = {"form": form}
    return render(request, template_name, context)


# Project day views
@login_required
def create_project_day(request, project_id):
    template_name = "report/project_day.html"
    # get project
    project = get_object_or_404(Project, project_id=project_id)
    context = {"project_name": project.name,
                "project_id": project.project_id}
    return render(request, template_name, context)


def select_project(request):
    template_name = "report/select_project.html"
    projects = Project.objects.order_by("created")
    context = {"projects" : projects}
    return render(request, template_name, context)

def select_project_and_day(request):
    template_name = "report/select_project_and_day.html"
    projects = Project.objects.order_by("created")
    context = {"projects" : projects}
    return render(request, template_name, context)


# edit project
@login_required
def edit_project(request, project_id):
    template_name = "report/edit_project.html"
    project = get_object_or_404(Project, project_id=project_id)

    if request.method == 'POST':
        form = CreateProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()

            return redirect("dashboard")
    else:
        form = CreateProjectForm(instance=project)
    context = {"form": form}
    return render(request, template_name, context)
        
# edit project day
def edit_project_day(request, project_id, project_day_id):
    template_name = "report/edit_project_day.html"
    # get project
    project = get_object_or_404(Project, project_id=project_id)
    project_day = get_object_or_404(ProjectDay, project_day_id=project_day_id)
    date = str(project_day.date)
    
    context = {"project_name": project.name,
                "project_id": project.project_id,
                "project_day_id": project_day_id,
                "date": date}
    return render(request, template_name, context)


# add Machine
def add_machine(request):
    template_name = "report/add_machine.html"
    machines = Machine.objects.all()
    if request.method == 'POST':
        form = CreateMachineForm(request.POST)
        if form.is_valid():
            machine_id = generate_random_id(15)
            form.instance.machine_id = machine_id
            form.save()

            if "save_quit" in request.POST:
                messages.success(request, "Machine Added")

                return redirect("dashboard")
            if "save_add" in request.POST:
                messages.success(request, "Machine Added")
                return redirect("add-machine")
    else:
        form=CreateMachineForm()
    context = {"form": form,
                "machines": machines}
    return render(request, template_name, context)

