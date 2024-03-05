
document.addEventListener('DOMContentLoaded', function() {
    var submitBtn = document.getElementById('submitEnvironmentForm');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            alert("Environment added successfully");
        });
    }
});
