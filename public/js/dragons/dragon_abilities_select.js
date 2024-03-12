/*
// This script transforms a multiple select element into a more user-friendly version with a search functionality
*/
document.addEventListener('DOMContentLoaded', function () {
    enhanceSelectMultipleWithSearchAndCheckboxes('input-abilities');
    enhanceSelectMultipleWithSearchAndCheckboxes('add-input-abilities');
});

function enhanceSelectMultipleWithSearchAndCheckboxes(selectElementId) {
    var selectElement = document.getElementById(selectElementId);
    if (!selectElement) {
        console.warn("Select element not found: " + selectElementId);
        return; 
    }

    var searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search abilities...';
    searchBox.onkeyup = filterOptions;
    selectElement.parentNode.insertBefore(searchBox, selectElement);

    var checkboxesContainer = document.createElement('div');
    selectElement.parentNode.insertBefore(checkboxesContainer, selectElement.nextSibling);
    selectElement.style.display = 'none'; 
    function filterOptions() {
        var searchQuery = this.value.toLowerCase();
        var checkboxes = checkboxesContainer.querySelectorAll('.faux-option');
        checkboxes.forEach(function(checkbox) {
            var text = checkbox.textContent.toLowerCase();
            if (text.indexOf(searchQuery) > -1) {
                checkbox.style.display = '';
            } else {
                checkbox.style.display = 'none';
            }
        });
    }
    Array.from(selectElement.options).forEach(function(option) {
        var checkbox = document.createElement('span');
        checkbox.className = 'faux-option';
        checkbox.textContent = option.text;
        checkbox.style.display = 'block';
        checkbox.onclick = function() {
            option.selected = !option.selected;
            checkbox.classList.toggle('selected', option.selected);
        };
        if (option.selected) {
            checkbox.classList.add('selected');
        }
        checkboxesContainer.appendChild(checkbox);
    });
}
function refreshFauxCheckboxesForSelect(selectElementId) {
    var selectElement = document.getElementById(selectElementId);
    var checkboxesContainer = selectElement.nextSibling;
    var options = selectElement.options;

    Array.from(options).forEach((option, index) => {
        if (checkboxesContainer.children[index]) {
            var fauxCheckbox = checkboxesContainer.children[index];
            if (option.selected) {
                fauxCheckbox.classList.add('selected');
            } else {
                fauxCheckbox.classList.remove('selected');
            }
        }
    });
}