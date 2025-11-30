export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }
  
  // Get headers from first object keys
  const headers = Object.keys(data[0])
  
  // Build CSV content
  const csvRows = []
  
  // Add header row
  csvRows.push(headers.join(','))
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]
      // Handle arrays (like services)
      if (Array.isArray(value)) {
        value = value.join('; ')
      }
      // Escape quotes and wrap in quotes
      const escaped = String(value ?? '').replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }
  
  // Create and download file
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export async function exportToPDF(data, filename, title) {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }
  
  // Dynamic import
  const { jsPDF } = await import('jspdf')
  await import('jspdf-autotable')
  
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 15)
  
  // Get headers and rows
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => {
    const val = row[h]
    return Array.isArray(val) ? val.join(', ') : String(val ?? '')
  }))
  
  // Create table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 110, 253] }
  })
  
  doc.save(filename)
}