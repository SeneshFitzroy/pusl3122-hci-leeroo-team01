/**
 * PDF export for admin analytics and reports.
 */
import { jsPDF } from 'jspdf'

/**
 * Export admin dashboard/analytics report as PDF.
 */
export function exportAdminReportPDF({ products = [], orders = [], designers = [], users = [], stats = {} }) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const margin = 20
  let y = margin

  // Title
  doc.setFontSize(22)
  doc.setFont(undefined, 'bold')
  doc.text('Lee Roo Admin Report', margin, y)
  y += 12

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)
  y += 10

  // Stats summary
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Summary', margin, y)
  y += 8

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Products: ${stats.products ?? products.length}`, margin, y)
  y += 6
  doc.text(`Orders: ${stats.orders ?? orders.length}`, margin, y)
  y += 6
  doc.text(`Designers: ${stats.designers ?? designers.length}`, margin, y)
  y += 6
  doc.text(`Users: ${stats.users ?? users.length}`, margin, y)
  y += 12

  // Products total value
  const totalValue = products.reduce((s, p) => s + (p.price || 0), 0)
  doc.setFont(undefined, 'bold')
  doc.text(`Total Product Value: $${totalValue.toLocaleString()}`, margin, y)
  y += 10

  // Orders summary
  if (orders.length > 0) {
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Recent Orders', margin, y)
    y += 8

    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    orders.slice(0, 10).forEach((o) => {
      if (y > 270) {
        doc.addPage()
        y = margin
      }
      doc.text(`${o.id?.slice(0, 12) || '—'} | ${o.customer || '—'} | ${o.amount || '$0'} | ${o.status || '—'}`, margin, y)
      y += 5
    })
    y += 8
  }

  // Designer list
  if (designers.length > 0) {
    if (y > 250) {
      doc.addPage()
      y = margin
    }
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Designers', margin, y)
    y += 8

    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    designers.forEach((d) => {
      if (y > 270) {
        doc.addPage()
        y = margin
      }
      doc.text(`${d.name || d.email || d.uid} (${d.email || '—'})`, margin, y)
      y += 5
    })
    y += 8
  }

  doc.save(`lee-roo-admin-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}
