import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceList from './pages/InvoiceList';
import InvoiceView from './pages/InvoiceView';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create" element={<CreateInvoice />} />
                    <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoice/:id" element={<InvoiceView />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;