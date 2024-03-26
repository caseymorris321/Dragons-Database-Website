/*
// This script ensures that the users slects one ability before form submission and provides an alert message if no abilities were selected.
*/
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('add-dragon-form'); 
    form.addEventListener('submit', function(event) {
        var selectAddInputAbilities = document.getElementById('add-input-abilities');
        var selectInputAbilities = document.getElementById('input-abilities');
        
        var selectededAddInputAbilities = Array.from(selectAddInputAbilities.options).some(option => option.selected);
        var selectedInputAbilities = Array.from(selectInputAbilities.options).some(option => option.selected);
        
        if (!selectededAddInputAbilities && !selectedInputAbilities) {
            alert('Please select at least one ability. Hint: most dragons can fly! Or you can add a new Ability using the Abilities page');
            event.preventDefault(); 
        }
    });
});