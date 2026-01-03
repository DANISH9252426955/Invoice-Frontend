import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Save } from 'lucide-react';

function Settings() {
  const { state, dispatch } = useInvoice();
  const [companyInfo, setCompanyInfo] = useState(state.companyInfo);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_COMPANY_INFO', payload: companyInfo });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Company Information</h2>
          <p>This information will appear on all your invoices.</p>
          
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                required
                value={companyInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>City, State ZIP</label>
              <input
                type="text"
                value={companyInfo.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Settings
              </button>
              {saved && <span className="save-message">Settings saved!</span>}
            </div>
          </form>
        </div>

        <div className="settings-section">
          <h2>Data Management</h2>
          <p>Manage your invoice data.</p>
          
          <div className="data-actions">
            <button 
              onClick={() => {
                const data = JSON.stringify(state, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'invoice-data-backup.json';
                a.click();
              }}
              className="btn btn-secondary"
            >
              Export Data
            </button>
            
            <button 
              onClick={() => {
                if (window.confirm('This will delete all your invoices. Are you sure?')) {
                  localStorage.removeItem('invoiceData');
                  window.location.reload();
                }
              }}
              className="btn btn-danger"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;