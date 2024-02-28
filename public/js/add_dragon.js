// Get the objects we need to modify
let addDragonForm = document.getElementById('add-dragon-form-ajax');

// Modify the objects we need
addDragonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDragonName = document.getElementById("input-name");
    let inputType = document.getElementById("input-type");
    let inputHeight = document.getElementById("input-height");
    let inputWeight = document.getElementById("input-weight");
    let inputAge = document.getElementById("input-age");
    let inputPersonality = document.getElementById("input-personality");
    let inputAlignment = document.getElementById("input-alignment");
    let inputEnvironment = document.getElementById("input-environment");
    let inputAbilities = document.getElementById("input-abilities");
    let inputNumber_of_people_killed = document.getElementById("input-number_of_people_killed");
    let inputLore = document.getElementById("input-Lore");

    // Get the values from the form fields
    let nameValue = inputDragonName.value;
    let typeValue = inputType.value;
    let heightValue = inputHeight.value;
    let weightValue = inputWeight.value;
    let ageValue = inputAge.value;
    let personalityValue = inputPersonality.value;
    let alignmentValue = inputAlignment.value;
    let environmentValue = inputEnvironment.value;
    let abilitiesValue = inputAbilities.value
    let loreValue = inputLore.value
   

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        type: typeValue,
        height: heightValue,
        weight: weightValue,
        age: ageValue,
        personality: personalityValue,
        alignment: alignmentValue,
        environment: environmentValue,
        abilities: abilitiesValue,
        number_of_people_killed: number_of_people_killedValue,
        lore: loreValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dragon-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDragonName.value = '';
            inputType.value = '';
            inputHeight.value = '';
            inputWeight.value = '';
            inputAge.value = '';
            inputPersonality.value = '';
            inputAlignment.value = '';
            inputEnvironment.value = '';
            inputAbilities.value = [];
            inputNumber_of_people_killed.value = '';
            inputLore.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let typeNameCell = document.createElement("TD");
    let heightCell = document.createElement("TD");
    let weightCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let personalityCell = document.createElement("TD");
    let alignmentCell = document.createElement("TD");
    let environmentCell = document.createElement("TD");
    let abilitiesCell = document.createElement("TD");
    let number_of_people_killedCell = document.createElement("TD");
    let loreCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    nameCell.innerText = newRow.name;
    typeNameCell.innerText = newRow.type;
    heightCell.innerText = newRow.height;
    weightCell.innerText = newRow.weight;
    ageCell.innerText = newRow.age;
    personalityCell.innerText = newRow.personality;
    alignmentCell.innerText = newRow.alignment;
    environmentCell.innerText = newRow.environment;
    abilitiesCell.innerText = newRow.abilities;
    number_of_people_killedCell.innerText = newRow.number_of_people_killed;
    loreCell.innerText = newRow.lore
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDragon(newRow.id);
    };


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(typeNameCell);
    row.appendChild(heightCell);
    row.appendChild(weightCell);
    row.appendChild(ageCell);
    row.appendChild(personalityCell);
    row.appendChild(alignmentCell);
    row.appendChild(environmentCell);
    row.appendChild(abilitiesCell);
    row.appendChild(number_of_people_killedCell);
    row.appendChild(loreCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    // let selectMenu = document.getElementById("mySelect");
    // let option = document.createElement("option");
    // option.text = newRow.fname + ' ' +  newRow.lname;
    // option.value = newRow.id;
    // selectMenu.add(option);
    // // End of new step 8 code.
}