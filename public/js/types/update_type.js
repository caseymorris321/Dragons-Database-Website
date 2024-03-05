let updateTypeForm = document.getElementById('update-type-form-ajax');

updateTypeForm.addEventListener("submit", function (e) {
   

    // Get form fields we need to get data from
    let typeId = document.getElementById("update-type-id").value;
    let typeName = document.getElementById("input-type-name").value;
    let typeAverageHeight = document.getElementById("input-type-average-height").value;
    let typeAverageWeight = document.getElementById("input-type-average-weight").value;
    let typeAverageAge = document.getElementById("input-type-average-age").value;
    let totalNumber = document.getElementById("input-total-number").value;

    // Put our data we want to send in a javascript object
    let data = {
        type_id: typeId,
        type_name: typeName,
        type_average_height: typeAverageHeight,
        type_average_weight: typeAverageWeight,
        type_average_age: typeAverageAge,
        total_number: totalNumber
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-type-ajax", true); // Adjust the URL to your API endpoint
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            alert("Type updated successfully");
            updateRow(xttp.response, data)
            window.location.reload();
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
            row.cells[1].innerText = type_name; // Assuming the second cell is the type name
            row.cells[2].innerText = type_average_height;
            row.cells[3].innerText = type_average_weight;
            row.cells[4].innerText = type_average_age;
            row.cells[5].innerText = total_number;
            break; // Exit the loop once the matching row is updated
        }
    }
}

