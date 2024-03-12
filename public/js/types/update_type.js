// <!-- Citation for the following code:
// Date: 03/04/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->
let updateTypeForm = document.getElementById('update-type-form-ajax');

updateTypeForm.addEventListener("submit", function (e) {


    // Get form fields we need to get data from
    let typeId = document.getElementById("update-type-id").value;
    let typeName = document.getElementById("input-type-name").value;
    let typeAverageHeight = document.getElementById("input-type-average-height").value;
    let typeAverageWeight = document.getElementById("input-type-average-weight").value;
    let typeAverageAge = document.getElementById("input-type-average-age").value;
    let totalNumberOfPeopleKilled = document.getElementById("input-total-number-of-people-killed").value;
    let totalNumber = document.getElementById("input-total-number").value;

    // Put our data we want to send in a javascript object
    let data = {
        type_id: typeId,
        type_name: typeName,
        type_average_height: typeAverageHeight,
        type_average_weight: typeAverageWeight,
        type_average_age: typeAverageAge,
        total_number_of_people_killed: totalNumberOfPeopleKilled,
        total_number: totalNumber
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-type-ajax", true); // Adjust the URL to your API endpoint
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, data)
            // window.location.reload();
            alert("Type updated successfully");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, typeID) {
    // Assuming typeData is the object containing the updated type details
    // and your table rows are marked with a data-value attribute matching the type's ID.
    let table = document.getElementById("types-table"); // Adjust ID as necessary
    for (let i = 1; i < table.rows.length; i++) { // Start loop at 1 to skip header row
        let row = table.rows[i];
        if (row.getAttribute("data-value") == typeID) {
            // Update each cell in the row; adjust indices as necessary for your table structure
            row.cells[1].innerText = data.type_name;
            row.cells[2].innerText = data.type_average_height;
            row.cells[3].innerText = data.type_average_weight;
            row.cells[4].innerText = data.type_average_age;
            row.cells[6].innterText = data.total_number_of_people_killed;
            row.cells[5].innerText = data.total_number;
            // Exit the loop once the matching row is updated
        }
    }
}

