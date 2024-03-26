/*
// This script allows table cells to expand or collapse on click.
*/
document.addEventListener('DOMContentLoaded', function () {
    var cells = document.querySelectorAll('tbody tr td');
    cells.forEach(function (cell) {
        if (cell.scrollWidth > cell.clientWidth) {
            cell.style.cursor = 'pointer';
        }
        cell.addEventListener('click', function () {
            if (cell.classList.contains('expanded')) {
                cell.classList.remove('expanded');
                cell.style.overflow = 'hidden';
                cell.style.textOverflow = 'ellipsis';
                cell.style.whiteSpace = 'nowrap';
            } else {
                cell.classList.add('expanded');
                cell.style.overflow = 'visible';
                cell.style.textOverflow = 'inherit';
                cell.style.whiteSpace = 'normal';
            }
        });
    });
});