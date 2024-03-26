/*
// This script makes the state of the table cell content togglable and changes the font weight of the label when toggled on.
*/
document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggleTableData');
    var label = document.querySelector('.table-data-label');
    var isExpanded = false;

    function updateCellStyles(cells, expand) {
        cells.forEach(function (cell) {
            if (expand) {
                cell.classList.add('expanded');
                cell.style.overflow = 'visible';
                cell.style.textOverflow = 'inherit';
                cell.style.whiteSpace = 'normal';
            } else {
                cell.classList.remove('expanded');
                cell.style.overflow = 'hidden';
                cell.style.textOverflow = 'ellipsis';
                cell.style.whiteSpace = 'nowrap';
            }
        });
    }

    toggleButton.addEventListener('click', function () {
        var cells = document.querySelectorAll('table tbody tr td');

        isExpanded = !isExpanded;

        updateCellStyles(cells, isExpanded);

        if (toggleButton.checked) {
            label.style.fontWeight = 'bold';
        } else {
            label.style.fontWeight = 'normal';
        }
    });
});