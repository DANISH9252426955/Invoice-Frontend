import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, List, Settings, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/create', icon: Plus, label: 'Create Invoice' },
    { path: '/invoices', icon: List, label: 'All Invoices' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <FileText size={32} />
          <h2>Invoice Manager</h2>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        
        <ul className="nav-menu">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link 
                to={path} 
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;