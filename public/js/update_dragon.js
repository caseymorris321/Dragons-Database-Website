// document.addEventListener('DOMContentLoaded', function() {
//     // Ensure the DOM is fully loaded before attaching event listeners
//     let updateDragonForm = document.getElementById('update-dragon-form-ajax');
//     if (!updateDragonForm) {
//         console.error('Update dragon form not found');
//         return;
//     }

//     updateDragonForm.addEventListener("submit", function(e) {
//         e.preventDefault(); // Prevent the default form submission

//         // Collect form data
//         let formData = {
//             dragon_id: document.querySelector("input[name='dragon_id']").value,
//             name: document.getElementById("input-name").value,
//             type: document.getElementById("input-type").value,
//             height: document.getElementById("input-height").value,
//             weight: document.getElementById("input-weight").value,
//             age: document.getElementById("input-age").value,
//             personality: document.getElementById("input-personality").value,
//             alignment: document.getElementById("input-alignment").value,
//             environment: document.getElementById("input-environment").value,
//             abilities: Array.from(document.querySelectorAll("#abilities option:checked")).map(option => option.value),
//             number_of_people_killed: document.getElementById("input-number_of_people_killed").value,
//             lore: document.getElementById("input-Lore").value
//         };

//         console.log("Form data to send:", formData);

//         // Setup AJAX request
//         var xhttp = new XMLHttpRequest();
//         xhttp.open("PUT", "/put-dragon-ajax", true);
//         xhttp.setRequestHeader("Content-type", "application/json");

//         xhttp.onreadystatechange = function() {
//             if (this.readyState == 4 && this.status == 200) {
//                 console.log("Update successful:", this.responseText);
//                 try {
//                     let response = JSON.parse(this.responseText);
//                     console.log("Parsed response:", response);
//                     // Assuming your table row update logic is correct
//                     updateRow(formData, formData.dragon_id);
//                 } catch (error) {
//                     console.error("Error parsing response JSON:", error, "Response was:", this.responseText);
//                 }
//             } else if (this.readyState == 4) {
//                 console.error("Error with the request. Status:", this.status);
//             }
//         };

//         // Send the request
//         xhttp.send(JSON.stringify(formData));
//     });
// });


// function updateRow(formData, dragonID) {
//     let table = document.getElementById("dragons-table");
//     for (let i = 0; i < table.rows.length; i++) {
//         let row = table.rows[i];
//         if (row.getAttribute("data-value") == dragonID) {
//             row.cells[1].innerText = formData.name; // Update only the name for testing
//             console.log("Row updated with name:", formData.name);
//             break;
//         }
//     }
// }

document.addEventListener('DOMContentLoaded', function() {
    const updateDragonForm = document.getElementById('update-dragon-form-ajax');
    if (!updateDragonForm) {
        console.error('Update dragon form not found');
        return;
    }

    updateDragonForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Retrieve the dragonId from the form's dataset
        const dragonId = updateDragonForm.getAttribute('data-dragon-id');
        const formData = {
            name: document.getElementById("input-name").value,
            type: document.getElementById("input-type").value,
            height: document.getElementById("input-height").value,
            weight: document.getElementById("input-weight").value,
            age: document.getElementById("input-age").value,
            personality: document.getElementById("input-personality").value,
            alignment: document.getElementById("input-alignment").value,
            environment: document.getElementById("input-environment").value,
            number_of_people_killed: document.getElementById("input-number_of_people_killed").value,
            lore: document.getElementById("input-lore").value,
        };

        var xhttp = new XMLHttpRequest();
        console.log(`/put-dragon-ajax/${dragonId}`);
        xhttp.open("PUT", `/put-dragon-ajax/${dragonId}`, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.onload = function() {
            if (xhttp.status === 200) {
                alert('Dragon updated successfully');
                // Optionally, refresh the page or update the UI as needed
                location.reload(); // This line will refresh the page. Remove it if you plan to update the UI directly.
            } else {
                alert('Failed to update dragon');
            }
        };
        xhttp.send(JSON.stringify(formData));
    });
});

function updateDragonRow(dragonId, formData) {
    const table = document.getElementById("dragons-table");
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute("data-value") === dragonId) {
            // Assuming the order of cells matches the formData structure
            rows[i].cells[1].innerText = formData.name;
            rows[i].cells[2].innerText = formData.type; // You might need to adjust this based on how you display types
            rows[i].cells[3].innerText = formData.height;
            rows[i].cells[4].innerText = formData.weight;
            rows[i].cells[5].innerText = formData.age;
            rows[i].cells[6].innerText = formData.personality;
            rows[i].cells[7].innerText = formData.alignment;
            rows[i].cells[8].innerText = formData.environment; // Adjust based on how you display environments
            rows[i].cells[9].innerText = formData.number_of_people_killed;
            rows[i].cells[10].innerText = formData.lore;
            // No need to update abilities here as they are not included in the formData
            break;
        }
    }
}