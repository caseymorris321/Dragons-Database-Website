function deleteAbility(abilityID) {
  if (confirm("Are you sure you want to delete this Ability? This Ability will be removed from its corresponding Dragons.")) {
      let link = '/delete-ability-ajax/';
      let data = {
          id: abilityID
      };

      $.ajax({
          url: link,
          type: 'DELETE',
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          success: function (result) {
              deleteRow(abilityID);
              alert("Ability deleted successfully");
          }
      });
  }
}
function deleteRow(abilityID) {

  let table = document.getElementById("abilities-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      if (table.rows[i].getAttribute("data-value") == abilityID) {
          table.deleteRow(i);
          break;
      }
  }
}