/*
// This function formats all numeric values within table cells to display with commas where appropriate
*/
function formatAllTableNumbers() {
    var tables = document.getElementsByTagName("table");

    for (var i = 0; i < tables.length; i++) {
        var rows = tables[i].rows;

        for (var j = 0; j < rows.length; j++) {
            var cells = rows[j].cells;

            for (var k = 0; k < cells.length; k++) {
                var cell = cells[k];
                var number = parseFloat(cell.innerText.replace(/,/g, '')); // 

                if (!isNaN(number)) {
                    cell.innerText = number.toLocaleString();
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", formatAllTableNumbers);