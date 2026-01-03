import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Eye, Edit, Trash2, Download } from 'lucide-react';

function InvoiceList() {
  const { state, dispatch } = useInvoice();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredInvoices = state.invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch = invoice.clientName.toLowerCase().includes(search.toLowerCase()) ||
                         invoice.invoiceNumber.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  const deleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch({ type: 'DELETE_INVOICE', payload: id });
    }
  };

  return (
    <div className="invoice-list">
      <div className="page-header">
        <h1>All Invoices</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Invoice
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'paid', 'overdue'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="invoice-table">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>#{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <span className={`status ${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link 
                        to={`/invoice/${invoice.id}`} 
                        className="btn btn-sm btn-secondary"
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => deleteInvoice(invoice.id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No invoices found.</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Invoice
          </Link>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;