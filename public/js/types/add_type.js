document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('typeAdded')) {
        alert("Type added successfully");
        localStorage.removeItem('typeAdded'); 
    }
  
    var submitBtn = document.getElementById('submitTypeForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            localStorage.setItem('typeAdded', true);
        });
    }
  });