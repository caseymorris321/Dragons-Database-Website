
document.addEventListener('DOMContentLoaded', function() {
    var submitBtn = document.getElementById('submitTypeForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            alert("Type added successfully");
        });
    }
});
