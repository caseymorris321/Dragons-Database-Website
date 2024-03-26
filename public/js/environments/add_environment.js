document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('environmentAdded')) {
        alert("Environment added successfully");
        localStorage.removeItem('environmentAdded'); 
    }
  
    var form = document.getElementById('add-environment-form');
    if (form) {
        form.addEventListener('submit', function(event) {

            // event.preventDefault();
            localStorage.setItem('environmentAdded', 'true');
            
        });
    }
  });