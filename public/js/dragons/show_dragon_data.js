function showform(dowhat) {
    /*
    * four DIVS: browse, insert, update, delete
    * this function sets one visible the others not
    */
    if (dowhat == 'insert') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'block';
        document.getElementById('insert-type').style.display = 'none';
        document.getElementById('insert-environment').style.display = 'none';
        document.getElementById('insert-ability').style.display = 'none';
        document.getElementById('update').style.display = 'none';
        document.getElementById('delete').style.display = 'none';
    }
    else if (dowhat == 'insert-type') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('insert-type').style.display = 'block';
        document.getElementById('insert-environment').style.display = 'none';
        document.getElementById('insert-ability').style.display = 'none';
        document.getElementById('update').style.display = 'none';
        document.getElementById('delete').style.display = 'none';
    }
    else if (dowhat == 'insert-environment') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('insert-type').style.display = 'none';
        document.getElementById('insert-environment').style.display = 'block';
        document.getElementById('insert-ability').style.display = 'none';
        document.getElementById('update').style.display = 'none';
        document.getElementById('delete').style.display = 'none';
    }
    else if (dowhat == 'insert-ability') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('insert-type').style.display = 'none';
        document.getElementById('insert-environment').style.display = 'none';
        document.getElementById('insert-ability').style.display = 'block';
        document.getElementById('update').style.display = 'none';
        document.getElementById('delete').style.display = 'none';
    }
    else if (dowhat == 'update') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('update').style.display = 'block';
        document.getElementById('delete').style.display = 'none';
    }
    else if (dowhat == 'delete') {
        document.getElementById('browse').style.display = 'none';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('update').style.display = 'none';
       document.getElementById('delete').style.display = 'block';
    }
    else if (dowhat == 'all') {
        document.getElementById('browse').style.display = 'block';
        document.getElementById('insert').style.display = 'block';
        document.getElementById('update').style.display = 'block';
       document.getElementById('delete').style.display = 'block';
    }
    else { //by default display browse
        document.getElementById('browse').style.display = 'block';
        document.getElementById('insert').style.display = 'none';
        document.getElementById('insert-type').style.display = 'none';
        document.getElementById('insert-environment').style.display = 'none';
        document.getElementById('insert-ability').style.display = 'none';
        document.getElementById('update').style.display = 'none';
       document.getElementById('delete').style.display = 'none';
    }
}

function newDragon() { showform('insert'); }
function newType() {showform('insert-type'); }
function newEnvironment() {showform('insert-environment'); }
function newAbility() {showform('insert-ability'); }
function updateDragon(dragonID) { showform('update'); }
function deleteDragon(dragonID) { showform('delete'); }
function browseDragons() { showform('browse'); }
function showAll() { showform('all'); }
function populateUpdateForm(dragonId) {
    $.ajax({
    url: `/dragons/${dragonId}`, // Adjust this URL to match your endpoint
    type: 'GET',
    success: function(data) {
        // Clear previous Abilities
        let abilitiesArray = data.abilities.split(', '); // Split the string into an array

            // Grab the select element for abilities
            let abilitiesSelect = document.getElementById('input-abilities');

            // Reset selections
            Array.from(abilitiesSelect.options).forEach(option => {
                option.selected = false; // Reset selection
            });

        // Types Dropdown
        let typeSelect = document.getElementById('input-type');
        if (!data.type) {
            Array.from(typeSelect.options).forEach(option => {
                if (option.value === "") { // "None" is a placeholder value for no type or NULL
                    option.selected = true;
                }
            });
        } else {
            Array.from(typeSelect.options).forEach(option => {
                if (option.text === data.type) {
                    option.selected = true;
                }
            });
        }
        
        // Environments Dropdown
         let environmentSelect = document.getElementById('input-environment');
        Array.from(environmentSelect.options).forEach(option => {
            if (option.text === data.environment) {
                option.selected = true;
            }
        });

        document.getElementById('update-dragon-id').value = data.dragon_id;
        document.getElementById('input-name').value = data.dragon_name;
        document.getElementById('input-height').value = data.dragon_height;
        document.getElementById('input-weight').value = data.dragon_weight;
        document.getElementById('input-age').value = data.dragon_age;
        document.getElementById('input-personality').value = data.dragon_personality;
        document.getElementById('input-alignment').value = data.dragon_alignment;
        document.getElementById('input-number_of_people_killed').value = data.number_of_people_killed;
        document.getElementById('input-lore').value = data.dragon_lore;

         // Abilities Select
         abilitiesArray.forEach(abilityName => {
            Array.from(abilitiesSelect.options).forEach(option => {
                if (option.textContent.trim() === abilityName.trim()) {
                    option.selected = true;
                }
            });
        });

        refreshFauxCheckboxesForSelect('input-abilities'); 
    },
    error: function(error) {
        console.log('Error fetching dragon details:', error);
    }
})

document.getElementById('update').style.display = 'block';
document.getElementById('browse').style.display = 'none';
}
