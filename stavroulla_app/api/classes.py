# Get api classes

class ProjectDaysTotalCostClass(object):
    def __init__(self, project_days, total_cost):
        self.project_days = project_days
        self.total_cost = total_cost


class EmployeePriceClass(object):
    def __init__(self, name, price):
        self.name = name
        self.price = price

class MachinePriceClass(object):
    def __init__(self, name, cost, machine_id):
        self.name = name
        self.cost = cost
        self.machine_id = machine_id

class ProjectDayDetailsClass(object):
    def __init__(self, date, employees, machines, materials_cost, sundries_cost, daily_cost, employee_cost, machine_cost, mat_sun_cost):
        self.date = date
        self.employees = employees
        self.machines = machines
        self.materials_cost = materials_cost
        self.sundries_cost = sundries_cost
        self.daily_cost = daily_cost
        self.employee_cost = employee_cost
        self.machine_cost = machine_cost
        self.mat_sun_cost = mat_sun_cost


class ProjectDayPostClass(object):
    def __init__(self, project_id, date, employees, machines, materials_cost, sundries_cost):
        self.project_id = project_id
        self.date = date
        self.employees = employees
        self.machines = machines
        self.materials_cost = materials_cost
        self.sundries_cost = sundries_cost


class EmployeesPostClass(object):
    def __init__(self, name, price):
        self.name = name
        self.price = price
    

class MachinesPostClass(object):
    def __init__(self, machine_id, name):
        self.machine_id = machine_id
        self.name = name

    

