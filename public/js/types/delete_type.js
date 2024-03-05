function deleteType(typeID) {
    if (confirm("Are you sure you want to delete this type?")) {
        let link = '/delete-type-ajax/';
        let data = {
            id: typeID
        };

        $.ajax({
            url: link,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                deleteRow(typeID);
                alert("Type deleted successfully");
            }
        });
    }
}

function deleteRow(typeID) {
    let table = document.getElementById("types-table"); // Ensure this ID matches your table's ID for types
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        if (table.rows[i].getAttribute("data-value") == typeID) {
            table.deleteRow(i);
            break;
        }
    }
}
