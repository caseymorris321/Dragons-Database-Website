// <!-- Citation for the following code:
// Date: 03/06/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

let updateAbilityForm = document.getElementById('update-ability-form-ajax');

// Modify the objects we need
updateAbilityForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    // e.preventDefault()

    // Get form fields we need to get data from
    let abilityId = document.getElementById("update-ability-id").value;
    let inputName = document.getElementById("input-ability-name");
    let inputProficiency = document.getElementById("input-ability-proficiency");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let proficiencyValue = inputProficiency.value

    
    // Put our data we want to send in a javascript object
    let data = {
        environment_id: abilityId,
        name: nameValue,
        proficiency: proficiencyValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ability-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            alert("Ability updated successfully");
            updateRow(xttp.response, data)
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, abilityID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("abilities-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == abilityID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[i];

            // Reassign data to our value we updated to
            td.innerHTML = parsedData[1].name; 
            td.innerHTML = parsedData[2].proficiency;  
       }
    }
}