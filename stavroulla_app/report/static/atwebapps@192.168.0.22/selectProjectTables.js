$(document).ready(function () {
  let domain = window.location.host;
  let nextBtn = document.getElementById("nextBtn");

  //Tables
  // Project Table
  var projectTable = $("#projectTableSelect").DataTable({
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

  // Project Table selector code
  $("#projectTableSelect tbody").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      nextBtn.disabled = true;
    } else {
      projectTable.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
      nextBtn.disabled = false;
    }
  });

  // Button event listener
  nextBtn.addEventListener("click", function () {
    var table = document.getElementById("projectTableSelect");
    var selectedRow = table.getElementsByClassName("selected")[0];
    var projectId = selectedRow.querySelectorAll("td")[5].innerHTML;
    let pathName = window.location.pathname;
    console.log(pathName);

    if (pathName == "/project/select-project-create/") {
      window.location.replace(
        `http://${domain}/project/add-project-day/${projectId}/`
      );
    }

    if (pathName == "/project/select-project-edit/") {
      window.location.replace(
        `http://${domain}/project/edit-project/${projectId}/`
      );
    }
  });
});
