from django.db import models
from django.db.models.deletion import CASCADE

# Create your models here.

# Project model
class Project(models.Model):
    project_id = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=100)
    created = models.DateField(auto_now_add=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank = True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{0}".format(self.name)

# Project Day model
class ProjectDay(models.Model):
    project_day_id = models.CharField(max_length=15)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField(null=False, blank=False)

    def __str__(self):
        return "{0} - {1}".format(self.project.name, self.date)

# Employee Models
class Employee(models.Model):
    employee_id = models.CharField(max_length=15)
    name = models.CharField(max_length=100)

    def __str__(self):
        return "{0}".format(self.name)


class EmployeePrice(models.Model):
    employee_price_id = models.CharField(max_length=15)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    project_day = models.ManyToManyField(ProjectDay)
    price = models.DecimalField(decimal_places=2, max_digits=9)

    def __str__(self):
        return "{0} - {1}".format(self.employee.name, self.price)
    
    

#Machine model

class Machine(models.Model):
    machine_id = models.CharField(max_length=15)
    name = models.CharField(max_length=100)

    def __str__(self):
        return "{0}".format(self.name)



class MachinePrice(models.Model):
    machine_price_id = models.CharField(max_length=15)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    project_day = models.ManyToManyField(ProjectDay, blank = True)
    cost = models.DecimalField(decimal_places=2, max_digits=9)

    def __str__(self):
        return "{0} - {1}".format(self.machine.name, self.cost)

# Material and Sundrie Model
class MaterialsAndSundries(models.Model):
    material_cost = models.DecimalField(decimal_places=2, max_digits=9)
    sundries_cost = models.DecimalField(decimal_places=2, max_digits=9)
    project_day = models.ForeignKey(ProjectDay, on_delete=models.CASCADE)

    def __str__(self):
        return "Material cost: {0} - Sundries cost {1}".format(self.material_cost, self.sundries_cost)
    


