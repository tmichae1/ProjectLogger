from django.db import models
from django.db.models import fields
from rest_framework import serializers
from report.models import ProjectDay, Employee, EmployeePrice, Machine, MaterialsAndSundries


# Serializers for Project day and total cost
class ProjectDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDay
        fields = "__all__"


class ProjectDaysTotalCostSerializer(serializers.Serializer):
    project_days = ProjectDaySerializer(many=True)
    total_cost = serializers.DecimalField(decimal_places=2, max_digits=15)


# Serializers for project day details

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields=['machine_id', 'name']


class MachinePriceSerializer(serializers.Serializer):
    name = serializers.CharField()
    cost = serializers.DecimalField(decimal_places=2, max_digits=9)
    machine_id = serializers.CharField()


class EmployeePriceSerializer(serializers.Serializer):
    name = serializers.CharField()
    price = serializers.DecimalField(decimal_places=2, max_digits=9)


class ProjectDayDetailsSerializer(serializers.Serializer):
    date = serializers.DateField()
    employees = EmployeePriceSerializer(many=True)
    machines = MachinePriceSerializer(many=True)
    materials_cost = serializers.DecimalField(decimal_places=2, max_digits=9)
    sundries_cost = serializers.DecimalField(decimal_places=2, max_digits=9)
    daily_cost = serializers.DecimalField(decimal_places=2, max_digits=15)
    employee_cost = serializers.DecimalField(decimal_places=2, max_digits=15)
    machine_cost = serializers.DecimalField(decimal_places=2, max_digits=15)
    mat_sun_cost = serializers.DecimalField(decimal_places=2, max_digits=15)


# Employee names serializer
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['name', 'employee_id']



# Project Day post Serializers

class EmployeePostSerializer(serializers.Serializer):
    name = serializers.CharField()
    price = serializers.DecimalField(decimal_places=2, max_digits=9)

class MachinePostSerializer(serializers.Serializer):
    machine_id = serializers.CharField()
    name = serializers.CharField()
    cost = serializers.DecimalField(decimal_places=2, max_digits=9)



class ProjectDayPostSerializer(serializers.Serializer):
    project_id = serializers.CharField()
    date = serializers.DateField()
    employees = EmployeePostSerializer(many=True)
    machines = MachinePostSerializer(many=True)
    materials_cost = serializers.DecimalField(decimal_places=2, max_digits=9)
    sundries_cost = serializers.DecimalField(decimal_places=2, max_digits=9)

# Edit Project Day serializer
class EditProjectDayPostSerializer(serializers.Serializer):
    project_id = serializers.CharField()
    project_day_id = serializers.CharField()
    date = serializers.DateField()
    employees = EmployeePostSerializer(many=True)
    machines = MachinePostSerializer(many=True)
    materials_cost = serializers.DecimalField(decimal_places=2, max_digits=9)
    sundries_cost = serializers.DecimalField(decimal_places=2, max_digits=9)
