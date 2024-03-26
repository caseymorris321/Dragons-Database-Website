document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('typeAdded')) {
        alert("Type added successfully");
        localStorage.removeItem('typeAdded'); 
    }
  
    var form = document.getElementById('add-type-form');
    if (form) {
        form.addEventListener('submit', function(event) {

            // event.preventDefault();
            localStorage.setItem('typeAdded', 'true');
            
        });
    }
  });