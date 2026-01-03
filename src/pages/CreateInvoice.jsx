import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Plus, Trash2 } from 'lucide-react';

function CreateInvoice() {
  const navigate = useNavigate();
  const { state, dispatch } = useInvoice();
  
  const [invoice, setInvoice] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: '',
    status: 'pending'
  });

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: state.nextInvoiceNumber,
      total: calculateTotal(),
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
    navigate('/invoices');
  };

  return (
    <div className="create-invoice">
      <div className="page-header">
        <h1>Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-section">
          <h2>Client Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Client Name *</label>
              <input
                type="text"
                required
                value={invoice.clientName}
                onChange={(e) => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Client Email</label>
              <input
                type="email"
                value={invoice.clientEmail}
                onChange={(e) => setInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
              />
            </div>
            <div className="form-group full-width">
              <label>Client Address</label>
              <textarea
                value={invoice.clientAddress}
                onChange={(e) => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Invoice Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Invoice Date *</label>
              <input
                type="date"
                required
                value={invoice.date}
                onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Items</h2>
            <button type="button" onClick={addItem} className="btn btn-secondary">
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="items-table">
            <div className="table-header">
              <div>Description</div>
              <div>Qty</div>
              <div>Rate</div>
              <div>Amount</div>
              <div></div>
            </div>
            
            {invoice.items.map((item, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                />
                <div className="amount">${(item.quantity * item.rate).toFixed(2)}</div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn btn-danger"
                  disabled={invoice.items.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="total-section">
            <div className="total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={invoice.notes}
              onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or terms..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;