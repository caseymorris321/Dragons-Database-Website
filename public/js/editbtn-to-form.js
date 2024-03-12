/*
// This script enables buttons with the class 'edit-btn' to scroll to and focus on the 'edit' forms when clicked
*/
document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');

    function scrollToForm() {
        const form = document.getElementById('update');
        
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        const inputs = form.querySelectorAll('input[type="text"], input[type="number"]');
        
        if (inputs.length > 1) {
            inputs[1].focus();
        }
    }

    editButtons.forEach(function(button) {
        button.addEventListener('click', scrollToForm);
    });
});