// <!-- Citation for the following code:
// Date: 03/06/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

let updateAbilityForm = document.getElementById('update-ability-form-ajax');

// Modify the objects we need
updateAbilityForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let abilityId = document.getElementById("update-ability-id").value;
    let inputName = document.getElementById("input-ability-name");
    let inputProficiency = document.getElementById("input-ability-proficiency");
    let inputTotalNumberOfDragons = document.getElementById("input-total-number-of-dragons");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let proficiencyValue = inputProficiency.value
    let totalNumberOfDragonsValue = inputTotalNumberOfDragons.value

    
    // Put our data we want to send in a javascript object
    let data = {
        ability_id: abilityId,
        name: nameValue,
        proficiency: proficiencyValue,
        totalNumberOfDragons: totalNumberOfDragonsValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ability-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            updateRow(xhttp.response, data)
            // window.location.reload();
            alert("Ability updated successfully");
            window.location.href = '/abilities';

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
            td.innerHtml = pasedData[3].totalNumberOfDragons
       }
    }
}
