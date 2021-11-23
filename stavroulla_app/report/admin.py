from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Project)
admin.site.register(models.ProjectDay)
admin.site.register(models.Employee)
admin.site.register(models.EmployeePrice)
admin.site.register(models.Machine)
admin.site.register(models.MachinePrice)
admin.site.register(models.MaterialsAndSundries)
