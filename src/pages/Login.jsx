import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FileText, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

function Login() {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@invoice.com',
      password: 'admin123'
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <FileText size={40} />
            </div>
            <h1>Invoice Manager</h1>
            <p>Sign in to manage your invoices</p>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="demo-section">
            <div className="divider">
              <span>Demo Access</span>
            </div>
            <button 
              type="button" 
              onClick={fillDemoCredentials}
              className="demo-btn"
            >
              Use Demo Credentials
            </button>
            <div className="demo-info">
              <p><strong>Email:</strong> admin@invoice.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          <div className="login-footer">
            <p>&copy; 2024 Invoice Manager. All rights reserved.</p>
          </div>
        </div>

        <div className="features-section">
          <h2>Professional Invoice Management</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Dashboard Analytics</h3>
                <p>Track your invoice performance with detailed analytics</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📄</div>
              <div>
                <h3>PDF Generation</h3>
                <p>Generate professional PDF invoices instantly</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <div>
                <h3>Client Management</h3>
                <p>Organize and manage all your clients efficiently</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div>
                <h3>Secure & Reliable</h3>
                <p>Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;