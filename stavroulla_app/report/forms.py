from django import forms
from .models import Employee, Machine, Project, ProjectDay



# Widget stuff
class DateInput(forms.DateInput):
    input_type = 'date'


# Project Form
class CreateProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ["name"]


# Project Day Form
class CreateProjectDayForm(forms.ModelForm):

    class Meta:
        model = ProjectDay
        widgets = {'date': DateInput()}
        fields = ['date']

# Employee Form
class CreateMachineForm(forms.ModelForm):
    class Meta:
        model = Machine
        fields = ["name"]