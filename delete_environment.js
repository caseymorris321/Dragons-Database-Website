// <!-- Citation for the following code:
// Date: 03/04/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

function deleteDragon(dragonID) {
  if (confirm("Are you sure you want to delete this environment?")) {
      let link = '/delete-wnvironment-ajax/';
      let data = {
          id: dragonID
      };

      $.ajax({
          url: link,
          type: 'DELETE',
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          success: function (result) {
              deleteRow(environmentID);
          }
      });
  }
}
function deleteRow(environmentID) {

  let table = document.getElementById("environments-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      if (table.rows[i].getAttribute("data-value") == environmentID) {
          table.deleteRow(i);
          break;
      }
  }
}