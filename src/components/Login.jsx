import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login(credentials);
      if (response.data.success) {
        onLogin(response.data.admin);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container split-layout">
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M16 8H8V16H16V8Z" fill="currentColor" opacity="0.4"/>
              <path d="M16 20H8V28H16V20Z" fill="currentColor" opacity="0.6"/>
              <path d="M28 8H20V16H28V8Z" fill="currentColor" opacity="0.8"/>
              <path d="M28 20H20V28H28V20Z" fill="currentColor"/>
              <path d="M40 8H32V16H40V8Z" fill="currentColor" opacity="0.7"/>
              <path d="M40 20H32V28H40V20Z" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <h1>Workforce Management</h1>
          <p>Streamline your team management with powerful admin tools and real-time analytics.</p>
        </div>
      </div>

      <div className="login-section">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Admin Sign In</h2>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>© 2025 Workforce Manager. Secure admin access.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;