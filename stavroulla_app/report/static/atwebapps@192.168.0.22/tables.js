$(document).ready(function () {
  // domain name
  let domain = window.location.host;

  //Tables
  // Project Table
  var projectTable = $("#projectTable").DataTable({
    responsive: {
      details: false,
    },
    columnDefs: [
      {
        targets: [5],
        className: "hide_column",
      },
    ],
  });

  // Project Day Table
  var projectDayTable = $("#projectDayTable").DataTable({
    lengthChange: false,
    searching: false,
    paging: false,
    info: false,
    columnDefs: [
      {
        targets: [1],
        className: "hide_column",
      },
    ],
  });

  // Employee Table
  var employeeTable = $("#employeeTable").DataTable({
    lengthChange: false,
    searching: false,
    paging: false,
    info: false,
  });

  // Machines Table
  var machineTable = $("#machineTable").DataTable({
    lengthChange: false,
    searching: false,
    paging: false,
    info: false,
  });

  // Materials and Sundries Table
  var materialsAndSundriesTable = $("#MaterialsAndSundriesTable").DataTable({
    lengthChange: false,
    searching: false,
    paging: false,
    info: false,
  });

  // Project Table selector code
  $("#projectTable tbody").on("click", "tr", function () {
    // Clear cost divs
    let totalCostDiv = document.getElementById("totalCost");
    totalCostDiv.innerHTML = ``;
    let dailyCostDiv = document.getElementById("dailyCost");
    dailyCostDiv.innerHTML = ``;
    // Clear Employee Cost span
    let employeeCostSpan = document.getElementById("employeeCost");
    employeeCostSpan.innerHTML = ``;
    // Clear Machine Cost span
    let machineCostSpan = document.getElementById("machineCost");
    machineCostSpan.innerHTML = ``;
    // Clear mat_and_sun Cost span
    let matSunCostSpan = document.getElementById("matSunCost");
    matSunCostSpan.innerHTML = ``;

    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      projectDayTable.clear().draw();
      employeeTable.clear().draw();
      machineTable.clear().draw();
      materialsAndSundriesTable.clear().draw();
    } else {
      projectDayTable.clear().draw();
      projectTable.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
      getProjectInfo();
    }
  });

  // Project Day Table selector code
  $("#projectDayTable tbody").on("click", "tr", function () {
    // Clear daily cost div
    let dailyCostDiv = document.getElementById("dailyCost");
    dailyCostDiv.innerHTML = ``;
    // Clear Employee Cost span
    let employeeCostSpan = document.getElementById("employeeCost");
    employeeCostSpan.innerHTML = ``;
    // Clear Machine Cost span
    let machineCostSpan = document.getElementById("machineCost");
    machineCostSpan.innerHTML = ``;
    // Clear mat_and_sun Cost span
    let matSunCostSpan = document.getElementById("matSunCost");
    matSunCostSpan.innerHTML = ``;

    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      employeeTable.clear().draw();
      machineTable.clear().draw();
      materialsAndSundriesTable.clear().draw();
    } else {
      employeeTable.clear().draw();
      machineTable.clear().draw();
      materialsAndSundriesTable.clear().draw();
      projectDayTable.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
      getProjectDayDetails();
    }
  });

  // API Calls
  function getProjectInfo() {
    var table = document.getElementById("projectTable");
    var selectedRow = table.getElementsByClassName("selected")[0];
    var projectId = selectedRow.querySelectorAll("td")[5].innerHTML;
    URL = `http://${domain}/api/get-project-days/${projectId}`;
    fetch(URL)
      .then((res) => res.json())
      .then(function (data) {
        let tableData = data;
        let projectDays = tableData.project_days;
        let totalCost = tableData.total_cost;

        let totalCostDiv = document.getElementById("totalCost");
        totalCostDiv.innerHTML = `<h3> Total Cost of Project - €${totalCost} </h3>`;

        if (projectDays.length > 0) {
          for (var i = 0; i < projectDays.length; i++) {
            let date = moment(projectDays[i].date, "YYYY-MM-DD").format(
              "MMM. DD, YYYY"
            );
            projectDayTable.row
              .add([date, projectDays[i].project_day_id])
              .draw(false);
          }
          $("#projectDayTable tbody tr:eq(0)").click();
        }
      });
  }

  function getProjectDayDetails() {
    var table = document.getElementById("projectDayTable");
    var selectedRow = table.getElementsByClassName("selected")[0];
    var project_day_id = selectedRow.querySelectorAll("td")[1].innerHTML;
    URL = `http://${domain}/api/get-project-day-details/${project_day_id}`;
    fetch(URL)
      .then((res) => res.json())
      .then(function (data) {
        // data variables
        var employees = data.employees;
        var machines = data.machines;
        var materials_cost = `€${data.materials_cost}`;
        var sundries_cost = `€${data.sundries_cost}`;
        var dailyCost = data.daily_cost;
        var employeeCost = data.employee_cost;
        var machineCost = data.machine_cost;
        var matSunCost = data.mat_sun_cost;

        // get daily cost div
        let dailyCostDiv = document.getElementById("dailyCost");
        dailyCostDiv.innerHTML = `<h3>Daily Cost - €${dailyCost}</h3>`;

        // get cost spans and update value
        let employeeCostSpan = document.getElementById("employeeCost");
        employeeCostSpan.innerHTML = `- €${employeeCost}`;

        let machineCostSpan = document.getElementById("machineCost");
        machineCostSpan.innerHTML = `- €${machineCost}`;

        let matSunCostSpan = document.getElementById("matSunCost");
        matSunCostSpan.innerHTML = `- €${matSunCost}`;

        if (employees.length > 0) {
          drawEmployeeTable(employees);
        }

        if (machines.length > 0) {
          drawMachineTable(machines);
        }

        drawMaterialsAndSundriesTable(materials_cost, sundries_cost);
      });
  }

  // Table Drawing functions

  // draw employee table
  function drawEmployeeTable(employees) {
    for (var i = 0; i < employees.length; i++) {
      let employeePrice = `€${employees[i].price}`;
      employeeTable.row.add([employees[i].name, employeePrice]).draw(false);
    }
  }

  function drawMachineTable(machines) {
    for (var i = 0; i < machines.length; i++) {
      let machineCost = `€${machines[i].cost}`;
      machineTable.row.add([machines[i].name, machineCost]).draw(false);
    }
  }

  function drawMaterialsAndSundriesTable(material_cost, sundries_cost) {
    materialsAndSundriesTable.row
      .add([material_cost, sundries_cost])
      .draw(false);
  }
});
