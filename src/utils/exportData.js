// Utility functions for exporting data

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions {field: 'key', headerName: 'Header'}
 * @returns {string} CSV string
 */
export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  // Extract headers
  const headers = columns.map(col => col.headerName || col.field);
  const headerRow = headers.join(',');

  // Extract rows
  const rows = data.map(item => columns.map(col => {
    const value = getNestedValue(item, col.field);
    // Escape commas and quotes in values
    const stringValue = value?.toString() || '';
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }).join(','));

  return [headerRow, ...rows].join('\n');
};

/**
 * Get nested object value using dot notation
 * @param {Object} obj - Object to extract value from
 * @param {string} path - Dot notation path (e.g., 'user.name')
 * @returns {any} Value at path
 */
const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file (without extension)
 */
export const downloadCSV = (csvContent, filename = 'export') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions
 * @param {string} filename - Name of the file
 */
export const exportToCSV = (data, columns, filename = 'export') => {
  const csv = convertToCSV(data, columns);
  downloadCSV(csv, filename);
};

/**
 * Print table
 * @param {string} title - Title of the printout
 * @param {Array} data - Array of objects to print
 * @param {Array} columns - Array of column definitions
 */
export const printTable = (title, data, columns) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  
  const headers = columns.map(col => col.headerName || col.field);
  const rows = data.map(item => 
    columns.map(col => getNestedValue(item, col.field) || '')
  );

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1976d2; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #1976d2; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .print-date { color: #666; font-size: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
