document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('dragonAdded')) {
        alert("Dragon added successfully");
        localStorage.removeItem('dragonAdded'); 
    }

    var submitBtn = document.getElementById('submitDragonForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            localStorage.setItem('dragonAdded', true);
        });
    }
});
