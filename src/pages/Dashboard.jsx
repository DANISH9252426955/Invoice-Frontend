import React from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

function Dashboard() {
  const { state } = useInvoice();
  const { invoices } = state;

  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0)
  };

  const recentInvoices = invoices.slice(-5).reverse();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Invoice
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Invoices</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.paid}</h3>
            <p>Paid</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign />
          </div>
          <div className="stat-content">
            <h3>${stats.totalAmount.toFixed(2)}</h3>
            <p>Total Amount</p>
          </div>
        </div>
      </div>

      <div className="recent-invoices">
        <h2>Recent Invoices</h2>
        {recentInvoices.length > 0 ? (
          <div className="invoice-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>
                      <Link to={`/invoice/${invoice.id}`}>
                        #{invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td>{invoice.clientName}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>${invoice.total.toFixed(2)}</td>
                    <td>
                      <span className={`status ${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No invoices yet. <Link to="/create">Create your first invoice</Link></p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;