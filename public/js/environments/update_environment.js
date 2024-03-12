// <!-- Citation for the following code:
// Date: 03/04/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

let updateEnvironmentForm = document.getElementById('update-environment-form-ajax');

// Modify the objects we need
updateEnvironmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    // e.preventDefault()

    // Get form fields we need to get data from
    let environmentId = document.getElementById("update-environment-id").value;
    let inputName = document.getElementById("input-environment-name");
    let inputTerrain = document.getElementById("input-environment-terrain");
    let inputClimate = document.getElementById("input-environment-climate");
    let inputTotalNumberOfDragons = document.getElementById("input-total-number-of-dragons");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let terrainValue = inputTerrain.value;
    let climateValue = inputClimate.value
    let totalNumberOfDragonsValue = inputTotalNumberOfDragons.value
    
    // Put our data we want to send in a javascript object
    let data = {
        environment_id: environmentId,
        name: nameValue,
        terrain: terrainValue,
        climate: climateValue,
        totalNumberOfDragons: totalNumberOfDragonsValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-environment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            updateRow(xhttp.response, data)
            // window.location.reload();
            alert("Environment updated successfully");

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, environmentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("environments-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == environmentID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[i];

            // Reassign data to our value we updated to
            td.innerHTML = parsedData[1].name; 
            td.innerHTML = parsedData[2].terrain; 
            td.innerHTML = parsedData[3].climate; 
            td.innerHTML = parsedData[4].totalNumberOfDragons
       }
    }
}