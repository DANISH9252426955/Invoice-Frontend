import jsPDF from 'jspdf';

export function generatePDF(invoice, companyInfo) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPosition = 20;

  // Company Header
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(companyInfo.name, 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(companyInfo.address, 20, yPosition);
  yPosition += 5;
  pdf.text(companyInfo.city, 20, yPosition);
  yPosition += 5;
  pdf.text(`Phone: ${companyInfo.phone}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${companyInfo.email}`, 20, yPosition);

  // Invoice Title and Number
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('INVOICE', pageWidth - 60, 30);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 60, 45);
  pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, pageWidth - 60, 55);
  if (invoice.dueDate) {
    pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 60, 65);
  }

  // Client Information
  yPosition = 80;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Bill To:', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(invoice.clientName, 20, yPosition);
  
  if (invoice.clientEmail) {
    yPosition += 7;
    pdf.text(invoice.clientEmail, 20, yPosition);
  }
  
  if (invoice.clientAddress) {
    yPosition += 7;
    const addressLines = invoice.clientAddress.split('\n');
    addressLines.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 7;
    });
  }

  // Items Table
  yPosition += 20;
  const tableStartY = yPosition;
  
  // Table Headers
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text('Description', 20, yPosition);
  pdf.text('Qty', 120, yPosition);
  pdf.text('Rate', 140, yPosition);
  pdf.text('Amount', 170, yPosition);
  
  // Table Header Line
  yPosition += 5;
  pdf.line(20, yPosition, 190, yPosition);
  
  // Table Items
  yPosition += 10;
  pdf.setFont(undefined, 'normal');
  
  invoice.items.forEach(item => {
    const amount = (item.quantity * item.rate).toFixed(2);
    
    pdf.text(item.description, 20, yPosition);
    pdf.text(item.quantity.toString(), 120, yPosition);
    pdf.text(`$${item.rate.toFixed(2)}`, 140, yPosition);
    pdf.text(`$${amount}`, 170, yPosition);
    
    yPosition += 10;
  });

  // Total
  yPosition += 10;
  pdf.line(140, yPosition - 5, 190, yPosition - 5);
  pdf.setFont(undefined, 'bold');
  pdf.text('Total:', 140, yPosition);
  pdf.text(`$${invoice.total.toFixed(2)}`, 170, yPosition);

  // Notes
  if (invoice.notes) {
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Notes:', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const noteLines = pdf.splitTextToSize(invoice.notes, 170);
    pdf.text(noteLines, 20, yPosition);
  }

  // Footer
  const footerY = pdf.internal.pageSize.height - 30;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'italic');
  pdf.text('Thank you for your business!', 20, footerY);

  // Save the PDF
  pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
}