

import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdminData = localStorage.getItem('adminData');
    if (savedAdminData) {
      try {
        const adminData = JSON.parse(savedAdminData);
        setAdmin(adminData);
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {admin ? (
        <Dashboard admin={admin} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

