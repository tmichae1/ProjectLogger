from django.shortcuts import get_object_or_404, render
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from report.models import Project, ProjectDay, Employee, EmployeePrice, Machine, MaterialsAndSundries, MachinePrice
from .serializer import EditProjectDayPostSerializer, EmployeePriceSerializer, EmployeeSerializer, MachineSerializer, ProjectDayDetailsSerializer, ProjectDaySerializer, ProjectDayPostSerializer, ProjectDaysTotalCostSerializer
from .classes import EmployeePriceClass, ProjectDayDetailsClass, MachinePriceClass, ProjectDaysTotalCostClass
from.functions import get_costs, get_daily_cost, get_total_cost
from report.functions import generate_random_id
import datetime


# Create your views here.
@api_view(['GET'])
def get_project_days(request, project_id):
    project = Project.objects.filter(project_id = project_id).first()

    project_days = ProjectDay.objects.filter(project=project)

    total_cost = get_total_cost(project_days)

    project_days_total_cost = ProjectDaysTotalCostClass(project_days, total_cost)
    serializer = ProjectDaysTotalCostSerializer(project_days_total_cost, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_project_day_details(request, project_day_id):
    project_day = ProjectDay.objects.filter(project_day_id = project_day_id).first()

    # get daily_cost
    daily_cost = get_daily_cost(project_day)
    costs = get_costs(project_day)

    # Get Employee details
    employee_list = list()
    employees = EmployeePrice.objects.filter(project_day=project_day)
    
    for employee in employees:
        current_employee = EmployeePriceClass(name=employee.employee.name, price=employee.price)
        employee_list.append(current_employee)
    
    # Get Machines
    machine_list = list()
    machines = MachinePrice.objects.filter(project_day = project_day)
    for machine in machines:
        current_machine = MachinePriceClass(name=machine.machine.name, cost=machine.cost, machine_id = machine.machine.machine_id)
        machine_list.append(current_machine)
    
    # Get materials and sundries
    materials_sundries = MaterialsAndSundries.objects.filter(project_day=project_day).first()

    # Build class for serialization
    details = ProjectDayDetailsClass(project_day.date,
                                        employee_list,
                                        machine_list,
                                        materials_sundries.material_cost,
                                            materials_sundries.sundries_cost,
                                            daily_cost, costs["employee_cost"],
                                            costs["machine_cost"],
                                            costs["mat_sun_cost"])

    serializer = ProjectDayDetailsSerializer(details, many=False)
    return Response(serializer.data)

# Get Employee Names
@api_view(['GET'])
def get_employees(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_machine_names(request):
    machines = Machine.objects.all()
    serializer = MachineSerializer(machines, many = True)
    return Response(serializer.data)


# Post Apis
@api_view(['POST'])
def add_project_day(request):
    serializer = ProjectDayPostSerializer(data=request.data)

    if(serializer.is_valid()):
        print(serializer.data)
        project_id = serializer.data['project_id']
        date = serializer.data['date']
        employees = serializer.data['employees']
        machines = serializer.data['machines']
        materials_cost = serializer.data['materials_cost']
        sundries_cost = serializer.data['sundries_cost']

        # Get the project
        project = get_object_or_404(Project, project_id = project_id)

        # Create the project day
        project_day_id = generate_random_id(15)
        created_project_day = ProjectDay(project_day_id=project_day_id, project=project, date=date)
        created_project_day.save()

        # get all project days for selected project for date analysis
        all_days = ProjectDay.objects.filter(project=project).order_by("date")
        if len(all_days) == 1:
            project.start_date = date
            project.save()
        elif len(all_days) == 2:
            start_date = project.start_date
            new_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()

            if start_date < new_date:
                project.end_date = new_date.strftime("%Y-%m-%d")
            else:
                project.start_date = new_date.strftime("%Y-%m-%d")
                project.end_date = start_date
            project.save()
        else:
            start_date = project.start_date
            end_date = project.end_date
            new_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()


            if new_date < start_date:
                project.start_date = new_date.strftime("%Y-%m-%d")
            elif new_date > end_date:
                project.end_date = new_date.strftime("%Y-%m-%d")
            
            project.save()

        # Add employees to day
        for employee in employees:
            employee_name = employee["name"]
            employee_price = employee["price"]

            #Check if employee already exists, if not , create new employee
            checked_employee = Employee.objects.filter(name=employee_name).first()
            if checked_employee is None:
                employee_id = generate_random_id(15)
                checked_employee = Employee(employee_id=employee_id,
                                            name=employee_name)
                checked_employee.save()
            
            # create new employee price
            employee_price_id = generate_random_id(15)
            created_employee_price = EmployeePrice(employee_price_id=employee_price_id,
                                                        employee=checked_employee,
                                                        price=employee_price)
            created_employee_price.save()
            
            # Add to many to many field
            created_employee_price.project_day.add(created_project_day)

        # Add machines
        for machine in machines:
            machine_id = machine["machine_id"]
            machine_cost = machine["cost"]
            selected_machine = get_object_or_404(Machine, machine_id=machine_id)
            machine_price_id = generate_random_id(15)
            created_machine_price = MachinePrice(machine_price_id = machine_price_id, machine=selected_machine, cost = machine_cost)
            created_machine_price.save()

            # Add to many to many field
            created_machine_price.project_day.add(created_project_day)
        
        # add materials and sundries cost
        created_mat_and_sun_cost = MaterialsAndSundries(material_cost = materials_cost, sundries_cost=sundries_cost, project_day=created_project_day)
        created_mat_and_sun_cost.save()
            

    return Response(serializer.data)

# view for updating project Day
@api_view(["POST"])
def update_project_day(request):
    serializer = EditProjectDayPostSerializer(data=request.data)
    if(serializer.is_valid()):
        # serializer variables
        project_id = serializer.data['project_id']
        project_day_id = serializer.data['project_day_id']
        date = serializer.data['date']
        employees = serializer.data['employees']
        machines = serializer.data['machines']
        materials_cost = serializer.data['materials_cost']
        sundries_cost = serializer.data['sundries_cost']

        print(project_id)
        print(project_day_id)

    

        # get instance of project day and project
        project = get_object_or_404(Project, project_id = project_id)
        project_day = get_object_or_404(ProjectDay, project_day_id = project_day_id)
        # Ammend date and save project day
        project_day.date = date
        project_day.save()

        # Change startdate/enddate of project if needed
        start_date = project.start_date
        end_date = project.end_date
        new_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()

        if end_date is None:
            project.start_date = new_date
            project.save()
        else:
            if new_date < start_date:
                project.start_date = new_date
                project.save()
            elif new_date > end_date:
                project.end_date = new_date
                project.save()



        # get all project day employee prices adn delete
        previous_employees = EmployeePrice.objects.filter(project_day=project_day)
        for prev_employee in previous_employees:
            prev_employee.delete()
        
        # add employee data from api
        for employee in employees:
            employee_name = employee["name"]
            employee_price = employee["price"]

            # Check if employee already exists, if not , create new employee
            checked_employee = Employee.objects.filter(name=employee_name).first()
            if checked_employee is None:
                employee_id = generate_random_id(15)
                checked_employee = Employee(employee_id=employee_id,
                                            name=employee_name)
                checked_employee.save()
            
            # create new employee price
            employee_price_id = generate_random_id(15)
            created_employee_price = EmployeePrice(employee_price_id=employee_price_id,
                                                        employee=checked_employee,
                                                        price=employee_price)
            created_employee_price.save()
            
            # Add to many to many field
            created_employee_price.project_day.add(project_day)
        
        # get all product day machine prices and delete
        previous_machines = MachinePrice.objects.filter(project_day = project_day)
        for prev_machine in previous_machines:
            prev_machine.delete()
        
        # add machine data from api
        for machine in machines:
                machine_id = machine["machine_id"]
                machine_cost = machine["cost"]
                selected_machine = get_object_or_404(Machine, machine_id=machine_id)
                machine_price_id = generate_random_id(15)
                created_machine_price = MachinePrice(machine_price_id = machine_price_id, machine=selected_machine, cost = machine_cost)
                created_machine_price.save()

                # Add to many to many field
                created_machine_price.project_day.add(project_day)
        
        # get and update material and sundries cost
        materials_and_sundries = MaterialsAndSundries.objects.filter(project_day = project_day).first()
        materials_and_sundries.material_cost = materials_cost
        materials_and_sundries.sundries_cost = sundries_cost
        materials_and_sundries.save()
    return Response(serializer.data)

       




 