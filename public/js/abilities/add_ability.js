document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('abilityAdded')) {
        alert("Ability added successfully");
        localStorage.removeItem('abilityAdded'); 
    }
  
    var form = document.getElementById('add-ability-form');
    if (form) {
        form.addEventListener('submit', function(event) {

            // event.preventDefault();
            localStorage.setItem('abilityAdded', 'true');
      
        });
    }
  });