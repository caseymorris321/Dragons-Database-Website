document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('add-dragon-form'); 
    form.addEventListener('submit', function(event) {
        var select = document.getElementById('add-input-abilities');
        var selected = Array.from(select.options).some(option => option.selected);
        
        if (!selected) {
            alert('Please select at least one ability. Hint: all dragons can fly! Or you can add a new Ability using the Abilities page');
            event.preventDefault(); 
        }
    });
});