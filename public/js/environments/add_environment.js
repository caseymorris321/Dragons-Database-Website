document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('environmentAdded')) {
        alert("Environment added successfully");
        localStorage.removeItem('environmentAdded'); 
    }
  
    var submitBtn = document.getElementById('submitEnvironmentForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            localStorage.setItem('environmentAdded', true);
        });
    }
  });