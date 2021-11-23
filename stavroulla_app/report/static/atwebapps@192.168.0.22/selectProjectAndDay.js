$(document).ready(function () {
  let domain = window.location.host;
  let nextBtn = document.getElementById("nextBtn");

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

  // Project Table selector code
  $("#projectTable tbody").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
      projectDayTable.clear().draw();
      $(this).removeClass("selected");
    } else {
      projectTable.$("tr.selected").removeClass("selected");
      projectDayTable.clear().draw();
      $(this).addClass("selected");
      getProjectInfo();
    }
  });

  // Project Day Table selector code
  $("#projectDayTable tbody").on("click", "tr", function () {
    // Clear daily cost div
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      nextBtn.disabled = true;
    } else {
      projectDayTable.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
      nextBtn.disabled = false;
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

  // Button event listener
  nextBtn.addEventListener("click", function () {
    // get project id
    var table = document.getElementById("projectTable");
    var selectedRow = table.getElementsByClassName("selected")[0];
    var projectId = selectedRow.querySelectorAll("td")[5].innerHTML;

    // get project day id
    var projectDayTable = document.getElementById("projectDayTable");
    var selectedRow = projectDayTable.getElementsByClassName("selected")[0];
    var projectDayId = selectedRow.querySelectorAll("td")[1].innerHTML;

    // redirect
    window.location = `http://${domain}/project/edit/${projectId}/${projectDayId}/`;
  });
});
