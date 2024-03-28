// <!-- Citation for the following code:
// Date: 12/28/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

let updateDragonForm = document.getElementById('update-dragon-form-ajax');

// Modify the objects we need
updateDragonForm.addEventListener("submit", function (e) {
    e.preventDefault()


    // Get form fields we need to get data from
    let dragonId = document.querySelector("input[name='dragon_id']").value;
    let inputName = document.getElementById("input-name");
    let inputType = document.getElementById("input-type");
    let inputHeight = document.getElementById("input-height")
    let inputWeight = document.getElementById("input-weight");
    let inputAge = document.getElementById("input-age");
    let inputPersonality = document.getElementById("input-personality");
    let inputAlignment = document.getElementById("input-alignment");
    let inputEnvironment = document.getElementById("input-environment");
    let inputAbilities = document.getElementById("input-abilities");
    let inputNumber_of_people_killed = document.getElementById("input-number_of_people_killed");
    let inputLore = document.getElementById("input-lore");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let typeValue = inputType.value;
    let heightValue = inputHeight.value;
    let weightValue = inputWeight.value;
    let ageValue = inputAge.value;
    let personalityValue = inputPersonality.value;
    let alignmentValue = inputAlignment.value;
    let environmentValue = inputEnvironment.value;
    let abilitiesValue = inputAbilities.value;
    let number_of_people_killedValue = inputNumber_of_people_killed.value;
    let loreValue = inputLore.value

    // if (isNaN(typeValue)) 
    // {
    //     return;
    // }

    let selectedOptions = inputAbilities.selectedOptions;
    let selectedAbilities = []; // Initialize the array to store selected abilities

    // Loop through the selected options and add their values to the selectedAbilities array
    for (let option of selectedOptions) {
        selectedAbilities.push(option.value);
    }

    // var checkedAbilities = [];
    // document.querySelectorAll('input[name="abilities[]"]:checked').forEach(function(checkbox) {
    //     checkedAbilities.push(checkbox.value);
    // });

    // Put our data we want to send in a javascript object
    let data = {
        dragon_id: dragonId,
        name: nameValue,
        type: typeValue,
        height: heightValue,
        weight: weightValue,
        age: ageValue,
        personality: personalityValue,
        alignment: alignmentValue,
        environment: environmentValue,
        abilities: selectedAbilities,
        number_of_people_killed: number_of_people_killedValue,
        lore: loreValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-dragon-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, data);
            // window.location.reload();
            alert("Dragon updated successfully");
            window.location.href = '/dragons';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, dragonID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("dragons-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == dragonID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[i];

            // Reassign data to our value we updated to
            td.innerHTML = parsedData[1].name;
            td.innerHTML = parsedData[2].type;
            td.innerHTML = parsedData[3].height;
            td.innerHTML = parsedData[4].weight;
            td.innerHTML = parsedData[5].age;
            td.innerHTML = parsedData[6].personality;
            td.innerHTML = parsedData[7].alignment;
            td.innerHTML = parsedData[8].environment;
            td.innerHTML = parsedData[9].abilities;
            td.innerHTML = parsedData[10].number_of_people_killed;
            td.innerHTML = parsedData[11].lore;
        }
    }
}