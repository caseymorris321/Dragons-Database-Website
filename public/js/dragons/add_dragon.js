document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('dragonAdded')) {
        alert("Dragon added successfully");
        localStorage.removeItem('dragonAdded'); 
    }
  
    var form = document.getElementById('add-dragon-form');
    if (form) {
        form.addEventListener('submit', function(event) {

            // event.preventDefault();
            localStorage.setItem('dragonAdded', 'true');
            
        });
    }
  });