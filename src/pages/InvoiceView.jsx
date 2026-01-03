import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useInvoice();
  
  const invoice = state.invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="invoice-view">
        <div className="error-message">
          <h2>Invoice not found</h2>
          <button onClick={() => navigate('/invoices')} className="btn btn-primary">
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const updateStatus = (newStatus) => {
    const updatedInvoice = { ...invoice, status: newStatus };
    dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generatePDF(invoice, state.companyInfo);
  };

  return (
    <div className="invoice-view">
      <div className="invoice-actions">
        <button onClick={() => navigate('/invoices')} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Invoices
        </button>
        <div className="action-buttons">
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} /> Print
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-secondary">
            <Download size={16} /> Download PDF
          </button>
          <select 
            value={invoice.status} 
            onChange={(e) => updateStatus(e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="invoice-document" id="invoice-content">
        <div className="invoice-header">
          <div className="company-info">
            <h1>{state.companyInfo.name}</h1>
            <p>{state.companyInfo.address}</p>
            <p>{state.companyInfo.city}</p>
            <p>Phone: {state.companyInfo.phone}</p>
            <p>Email: {state.companyInfo.email}</p>
          </div>
          <div className="invoice-meta">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
            {invoice.dueDate && (
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            )}
            <p><strong>Status:</strong> 
              <span className={`status ${invoice.status}`}>{invoice.status}</span>
            </p>
          </div>
        </div>

        <div className="client-info">
          <h3>Bill To:</h3>
          <p><strong>{invoice.clientName}</strong></p>
          {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
          {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
        </div>

        <div className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.rate.toFixed(2)}</td>
                  <td>${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-total">
          <div className="total-row">
            <span>Total Amount:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="invoice-notes">
            <h3>Notes:</h3>
            <p>{invoice.notes}</p>
          </div>
        )}

        <div className="invoice-footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;