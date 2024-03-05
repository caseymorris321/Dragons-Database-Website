// <!-- Citation for the following code:
// Date: 12/28/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

function deleteDragon(dragonID) {
    if (confirm("Are you sure you want to delete this dragon?")) {
        let link = '/delete-dragon-ajax/';
        let data = {
            id: dragonID
        };

        $.ajax({
            url: link,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                deleteRow(dragonID);
                alert("Dragon deleted successfully");
            }
        });
    }
}
function deleteRow(dragonID) {

    let table = document.getElementById("dragons-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == dragonID) {
            table.deleteRow(i);
            break;
        }
    }
}