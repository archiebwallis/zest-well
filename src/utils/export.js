import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || ''
        // Escape commas and quotes
        if (value.toString().includes(',') || value.toString().includes('"')) {
          return `"${value.toString().replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

export const exportToPDF = (data, columns, title = 'Data Export', filename = 'export.pdf') => {
  if (!data || data.length === 0) return
  
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 22)
  
  // Prepare table data
  const headers = columns.map(col => col.label)
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key] || ''
      // Handle arrays (like services)
      if (Array.isArray(value)) {
        return value.join(', ')
      }
      return value.toString()
    })
  )
  
  // Create table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 110, 253] }
  })
  
  doc.save(filename)
}