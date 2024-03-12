/*
// This function filters rows in all tables on a page based on input from a search field. It hides rows that don't match the search query while keeping matching rows visible.
*/
function searchTables() {
    var input, filter, tables, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    tables = document.querySelectorAll("table");

    tables.forEach(function(table) {
        tr = table.getElementsByTagName("tr");

        for (j = 0; j < tr.length; j++) {
  
            tr[j].style.display = "";

            if (tr[j].querySelector("th")) {
                continue;
            }

            if (filter === "") {
                continue;
            }

            var found = false;
            td = tr[j].getElementsByTagName("td");
            for (i = 0; i < td.length; i++) {
                if (td[i]) {
                    txtValue = td[i].textContent || td[i].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
            }

            tr[j].style.display = found ? "" : "none";
        }
    });
}
