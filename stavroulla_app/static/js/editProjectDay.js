// domain
let domain = window.location.host;
// url path name
const pathArray = window.location.pathname.split("/");
let project_day_id = pathArray[4];
let project_id = pathArray[3];

// static variables
var form = document.getElementById("projectForm");
var cardHeader = document.getElementById("cardHeader");
var topHeader = document.getElementById("topHeader");
let button;
//variables for class contruction (loaded through get request)

let projectDayDate;
let employees = [];
let machines = [];
let materialsCost = 0;
let sundriesCost = 0;
// initial api call to get machine names

let machineNames = [];
fetch(`http://${domain}/api/get-project-day-details/${project_day_id}/`)
  .then((res) => res.json())
  .then(function (data) {
    let projectDayData = data;
    // assign date
    projectDayDate = projectDayData.date;
    console.log(data);

    // create employee class instances
    for (let i = 0; i < projectDayData.employees.length; i++) {
      let employee = new Employee(
        projectDayData.employees[i].name,
        projectDayData.employees[i].price
      );
      employees.push(employee);
    }
    // create machine class instances
    for (let i = 0; i < projectDayData.machines.length; i++) {
      let machine = new Machine(
        projectDayData.machines[i].machine_id,
        projectDayData.machines[i].name,
        projectDayData.machines[i].cost
      );
      machines.push(machine);
    }

    // create material and sundries instance
    materialsCost = projectDayData.materials_cost;
    sundriesCost = projectDayData.sundries_cost;

    let date_picker = document.getElementById("projectDayDate");
    date_picker.setAttribute("value", projectDayDate);

    let btn = document.getElementById("nextButton");
    btn.disabled = false;
  });
fetch(`http://${domain}/api/get-machines/`)
  .then((res) => res.json())
  .then(function (data) {
    for (var i = 0; i < data.length; i++) {
      let machine = [];
      machine.push(data[i].name);
      machine.push(data[i].machine_id);
      machineNames.push(machine);
    }
  });

// form generating functions
// Generate projectDayForm
function generateProjectDayForm() {
  cardHeader.innerHTML = `Edit Project Day`;
  form.innerHTML = `
   <fieldset class="form-group">
       <legend class="border-bottom mb-4">Add Project Day</legend>
     </fieldset>
     <div class="form-group">
         <label for="projectDayDate">Date</label>
         <input type="date" name="date" id="projectDayDate" class="form-control" required>
     </div>
     <br />
     <div class="d-grid gap-2 d-md-block">
       <button class="btn btn-dark" id="nextButton" name="projectDayBtn" disbaled >Next</button>
     </div>
     `;

  let date_picker = document.getElementById("projectDayDate");

  button = document.getElementById("nextButton");
  date_picker.addEventListener("blur", function (e) {
    let date = e.target.value;

    if (!Date.parse(date)) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  });

  handleBtnClick(button);
}

// Generate Employee Form
function generateEmployeesForm() {
  cardHeader.innerHTML = `Add Employees`;
  topInfo.innerHTML += ` - ${moment(projectDayDate, "YYYY-MM-DD").format(
    "MMM. DD, YYYY"
  )}`;
  form.innerHTML = `
     <fieldset class="form-group">
       <legend class="border-bottom mb-4">Add Employees</legend>
     </fieldset>
     <div class="form-group" id="employeeDiv">
     </div>
     <div class="d-grid gap-2 d-md-block">
       <button class="btn btn-dark" id="nextButton" name="employeeBtn">Next</button>
     </div>
     `;
  var employeeDiv = document.getElementById("employeeDiv");
  for (let i = 1; i <= 10; i++) {
    employeeDiv.innerHTML += `
       <h5>Employee ${i}</h5>
       <label for="employeeName${i}">Employee Name</label>
       <input
         type="text"
         class="form-control"
         name="employee"
         id="employeeName${i}"
         placeholder="Employee Name..."
       />
       <br />
       <label for="employeePrice${i}">Employee Price</label>
       <input
         type="number"
         class="form-control"
         name="employee_price"
         id="employeePrice${i}"
         disabled
       />
       <br />
       <hr />
       `;
  }

  let employeeNamesInput = document.getElementsByName("employee");
  let employeePriceInput = document.getElementsByName("employee_price");

  // fill up fields with employee data
  console.log(employees.length);
  for (let i = 0; i < employees.length; i++) {
    employeeNamesInput[i].value = employees[i].name;
    employeePriceInput[i].disabled = false;
    employeePriceInput[i].value = employees[i].price;
  }

  for (let i = 0; i < employeeNamesInput.length; i++) {
    employeeNamesInput[i].addEventListener("blur", function (e) {
      if (e.target.value != "") {
        employeePriceInput[i].disabled = false;
      } else {
        employeePriceInput[i].disabled = true;
      }
    });
  }

  button = document.getElementById("nextButton");
  handleBtnClick(button);
}

// Generate machines form
function generateMachineForm() {
  cardHeader.innerHTML = `Add Machines`;
  form.innerHTML = `
        <fieldset class="form-group">
            <legend class="border-bottom mb-4">Add Machines</legend>
        </fieldset>
        <div class="form-group" id="machineDiv">
        </div>
        <div class="d-grid gap-2 d-md-block">
            <button class="btn btn-dark" id="nextButton" name="machineBtn">Next</button>
        </div>
    `;

  // Code to get all select options
  var selectOptions = ``;
  for (let i = 0; i < machineNames.length; i++) {
    selectOptions += `
            <option value="${machineNames[i][1]}">${machineNames[i][0]}</option>
        `;
  }

  var machineDiv = document.getElementById("machineDiv");
  for (let i = 0; i < machineNames.length; i++) {
    machineDiv.innerHTML += `
        <h5>Machine ${i + 1}</h5>
        <label for="machineSelect${i}">Machines</label>
        <select name="machines" class="form-control" id="machineSelect${i}">
            ${selectOptions}
        </select>
        <label for="machinePrice${i}">Machine Price</label>
        <input
          type="number"
          class="form-control"
          name="machine_price"
          id="machinePrice${i}"
          disabled
        />

        <br />
        `;
  }

  // get all select boxes and change there defualt to blank
  var selectBoxes = document.getElementsByName("machines");
  var inputs = document.getElementsByName("machine_price");
  for (let i = 0; i < selectBoxes.length; i++) {
    selectBoxes[i].selectedIndex = -1;
  }

  // fill in machine data
  for (let i = 0; i < machines.length; i++) {
    let machine_id = machines[i].machine_id;
    let machine_cost = machines[i].cost;
    let index;
    for (let j = 0; j < selectBoxes.length; j++) {
      if (selectBoxes[i].options[j].value == machine_id) {
        index = selectBoxes[i].options[j].index;
      }
    }
    selectBoxes[i].selectedIndex = index;
    inputs[i].disabled = false;
    inputs[i].value = machine_cost;
  }

  // Event listerner
  for (let i = 0; i < selectBoxes.length; i++) {
    selectBoxes[i].addEventListener("blur", function (e) {
      if (e.target.selectedIndex != -1) {
        inputs[i].disabled = false;
      } else {
        inputs[i].disabled = true;
      }
    });
  }

  button = document.getElementById("nextButton");
  handleBtnClick(button);
}

// Generate Materials and sundries form
function generateMaterialsSundriesForm() {
  cardHeader.innerHTML = `Materials & Sundries`;

  form.innerHTML = `
      <fieldset class="form-group">
        <legend class="border-bottom mb-4">Add Employees</legend>
      </fieldset>
      <div class="form-group">
        <label for="materialCost">Cost of Materials</label>
        <input
          type="number"
          class="form-control"
          name="materialSundries"
          id="materialCost"
          value="0"
          min="0"
          step="0.01"
        />
        <br>
        <label for="sundriesCost">Cost of Sundries</label>
        <input
          type="number"
          class="form-control"
          name="materialSundries"
          id="sundriesCost"
          value="0"
          min="0"
          step="0.01"
        />
        <br>
      </div>
      <div class="d-grid gap-2 d-md-block">
        <button class="btn btn-dark" id="nextButton" name="materialSundriesBtn">Next</button>
      </div>
    `;

  let inputs = document.getElementsByName("materialSundries");

  // Fill in Data
  inputs[0].value = materialsCost;
  inputs[1].value = sundriesCost;

  // Add event listeners to keep value at 0 if negative of none
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("blur", function (e) {
      if (e.target.value == "") {
        e.target.value = 0;
      } else if (e.target.value < 0) {
        e.target.value = 0;
      }
    });
  }
  button = document.getElementById("nextButton");
  handleBtnClick(button);
}

// Generate Summery Page
function generateSummery() {
  cardHeader.innerHTML = `Summery`;
  form.innerHTML = `
    <div>
      <h5>Project day Date - ${moment(projectDayDate, "YYYY-MM-DD").format(
        "MMM. DD, YYYY"
      )}</h5>
    </div>
    <hr>
    <div id="summeryEmployees"></div>
    <hr>
    <div id="summeryMachines"></div>
    <hr>
    <div>
      <h5>cost of materials - €${materialscost}</h5>
      <h5>cost of sundries - €${sundriesCost}</h5>
    </div>
    <br>
    <div class="d-grid gap-2 d-md-block">
        <button class="btn btn-dark" id="nextButton" name="summeryBtn" type="submit" >Next</button>
      </div>
    `;

  // Add employee sumerry section
  if (employees.length > 0) {
    for (let i = 0; i < employees.length; i++)
      document.getElementById("summeryEmployees").innerHTML += `
        <h5>Employee name - ${employees[i].name}</h5>
        <h5>Employee Price - €${employees[i].price} </h5>
        <br>
      `;
  } else {
    document.getElementById("summeryEmployees").innerHTML = `
        <h5>No Employees Selected </h5>
      `;
  }

  // Add Machine summery section
  if (machines.length > 0) {
    for (let i = 0; i < machines.length; i++)
      document.getElementById("summeryMachines").innerHTML += `
        <h5> Machine - ${machines[i].name}</h5>
        <h5> Machine Cost - €${machines[i].cost}</h5>
        
      `;
  } else {
    document.getElementById("summeryMachines").innerHTML = `
        <h5>No Machines Selected </h5>
      `;
  }

  button = document.getElementById("nextButton");
  handleBtnClick(button);
}

// classes
class ProjectDay {
  constructor(
    project_id,
    project_day_id,
    date,
    employees,
    machines,
    materials_cost,
    sundries_cost
  ) {
    this.project_id = project_id;
    this.project_day_id = project_day_id;
    this.date = date;
    this.employees = employees;
    this.machines = machines;
    this.materials_cost = materials_cost;
    this.sundries_cost = sundries_cost;
  }
}

class Employee {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

class Machine {
  constructor(machine_id, name, cost) {
    this.machine_id = machine_id;
    this.name = name;
    this.cost = cost;
  }
}

class MaterialsAndSundries {
  constructor(material_cost, sundries_cost) {
    this.material_cost = material_cost;
    this.sundries_cost = sundries_cost;
  }
}

// btn event function
function handleBtnClick(button) {
  button.addEventListener("click", function (e) {
    if (e.target.name == "projectDayBtn") {
      // set projectDayDate value
      projectDayDate = document.getElementById("projectDayDate").value;
      generateEmployeesForm();
    } else if (e.target.name == "employeeBtn") {
      // clear employees array
      employees = [];
      // builds the Employee class and generates the machine form on completion
      let employeeNamesInput = document.getElementsByName("employee");
      let employeePriceInput = document.getElementsByName("employee_price");
      for (let i = 0; i < employeeNamesInput.length; i++) {
        if (employeeNamesInput[i].value != "") {
          let name = employeeNamesInput[i].value;
          let price = employeePriceInput[i].value;

          let employee = new Employee(name, price);
          employees.push(employee);
        }
      }
      generateMachineForm();
    } else if (e.target.name == "machineBtn") {
      // clear machines array
      machines = [];
      // Generates the machine class, and builds materials and sundries form on completion
      let selectors = document.getElementsByName("machines");
      let inputs = document.getElementsByName("machine_price");
      for (let i = 0; i < selectors.length; i++) {
        if (selectors[i].selectedIndex >= 0) {
          let machine_id = selectors[i].value;
          let name = selectors[i].options[selectors[i].selectedIndex].text;
          let cost = inputs[i].value;
          let machine = new Machine(machine_id, name, cost);
          machines.push(machine);
        }
      }
      generateMaterialsSundriesForm();
    } else if (e.target.name == "materialSundriesBtn") {
      // Add to the materials and sundries variables and builds summery on completion
      let inputs = document.getElementsByName("materialSundries");
      materialscost = inputs[0].value;
      sundriesCost = inputs[1].value;
      generateSummery();
    } else if (e.target.name == "summeryBtn") {
      // builds the final projectDay class and posts that to an api
      let projectDay = new ProjectDay(
        project_id,
        project_day_id,
        projectDayDate,
        employees,
        machines,
        materialscost,
        sundriesCost
      );
      console.log(projectDay);
      const csrftoken = getCookie("csrftoken");

      fetch(`http://${domain}/api/edit-project-day/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(projectDay),
      });
      window.location.replace(`http://${domain}`);
    }
  });
}

// CSRF TOKEN Function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

generateProjectDayForm();
