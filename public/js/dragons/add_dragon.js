
document.addEventListener('DOMContentLoaded', function() {
    var submitBtn = document.getElementById('submitDragonForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            alert("Dragon added successfully");
        });
    }
});
