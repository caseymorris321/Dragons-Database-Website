/*
// This script enables buttons with the class 'new-btn' to scroll to and focus on the 'new' forms when clicked
*/
document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.new-btn');

    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const targetFormId = button.getAttribute('data-target-form');
            const form = document.getElementById(targetFormId);
            
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                const firstInput = form.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
    });
});
