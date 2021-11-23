from report.models import EmployeePrice, MachinePrice, MaterialsAndSundries
from decimal import Decimal

def get_daily_cost(project_day):
    daily_cost = Decimal(0.00)

    employee_prices = EmployeePrice.objects.filter(project_day=project_day)
    for employee_price in employee_prices:
        daily_cost += Decimal(employee_price.price)
    
    # work out cost for machines
    machine_prices = MachinePrice.objects.filter(project_day=project_day)
    for machine_price in machine_prices:
        daily_cost += Decimal(machine_price.cost)

    # add prices for materials and sundries
    materials_and_sundries = MaterialsAndSundries.objects.filter(project_day=project_day).first()
    daily_cost += (Decimal(materials_and_sundries.material_cost + materials_and_sundries.sundries_cost))

    return daily_cost




def get_total_cost(project_days):
    total_cost = Decimal(0.00)
    # loop through project days
    for project_day in project_days:
       total_cost += get_daily_cost(project_day)
    return total_cost

def get_costs(project_day):
    employee_cost = Decimal(0.00)
    machine_cost = Decimal(0.00)
    mat_sun_cost = Decimal(0.00)

    employee_prices = EmployeePrice.objects.filter(project_day=project_day)
    for employee_price in employee_prices:
        employee_cost += Decimal(employee_price.price)

    # work out cost for machines
    machine_prices = MachinePrice.objects.filter(project_day=project_day)
    for machine_price in machine_prices:
        machine_cost += Decimal(machine_price.cost)
    
     # add prices for materials and sundries
    materials_and_sundries = MaterialsAndSundries.objects.filter(project_day=project_day).first()
    mat_sun_cost += (Decimal(materials_and_sundries.material_cost + materials_and_sundries.sundries_cost))

    costs = {"employee_cost": employee_cost, "machine_cost": machine_cost, "mat_sun_cost": mat_sun_cost}
    return costs



        