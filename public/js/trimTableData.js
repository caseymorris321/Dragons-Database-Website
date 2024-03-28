document.addEventListener('DOMContentLoaded', (event) => {
  // Loop through all tables
  document.querySelectorAll('table').forEach((table, tableIndex) => {
      // Skip the first table assuming it contains icons
      if (tableIndex === 0) return;

      // Loop through all rows in each table
      table.querySelectorAll('td').forEach(row => {
          // Loop through all cells in the row except the first cell
          Array.from(row.cells).slice(1).forEach(cell => {
              // Trim the text content of the cell
              cell.textContent = cell.textContent.trim();
          });
      });
  });
});
