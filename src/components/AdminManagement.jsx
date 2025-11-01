import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/AdminManagement.css';

const AdminManagement = ({ currentAdmin }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentAdmin.role === 'super_admin') {
      fetchAdmins();
    }
  }, [currentAdmin]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAll();
      if (response.data.success) {
        setAdmins(response.data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to load admins' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await adminAPI.create(formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Admin created successfully' });
        setFormData({ name: '', email: '', password: '' });
        setShowForm(false);
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create admin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      await adminAPI.update(adminId, { isActive: !currentStatus });
      setMessage({ type: 'success', text: 'Admin status updated' });
      fetchAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update admin' 
      });
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to delete "${adminName}"?`)) {
      return;
    }

    try {
      await adminAPI.delete(adminId);
      setMessage({ type: 'success', text: 'Admin deleted successfully' });
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete admin'
      });
    }
  };

  if (currentAdmin.role !== 'super_admin') {
    return (
      <div className="admin-management">
        <div className="access-denied">
          <h3>Access Denied</h3>
          <p>You need super admin privileges to access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-management">
      <div className="admin-header">
        <h2>Admin Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="admin-form">
          <h3>Create New Admin</h3>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter admin name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter admin email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter password (min 6 characters)"
                minLength="6"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        </div>
      )}

      <div className="admins-list">
        <h3>Admin Accounts ({admins.length})</h3>
        {loading ? (
          <div className="loading">Loading admins...</div>
        ) : (
          <div className="admins-grid">
            {admins.map((admin) => (
              <div key={admin.id} className="admin-card">
                <div className="admin-info">
                  <h4>{admin.name}</h4>
                  <p className="admin-email">{admin.email}</p>
                  <div className="admin-meta">
                    <span className={`role-badge ${admin.role}`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                    <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="admin-date">
                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="admin-actions">
                  {admin.role !== 'super_admin' && (
                    <>
                      <button
                        onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                        className={`btn-sm ${admin.isActive ? 'btn-warning' : 'btn-success'}`}
                      >
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                        className="btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;