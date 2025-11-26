
import React, { useState } from 'react';
import { companyAPI } from '../services/api';
import '../styles/CandidateTable.css';

const CompanyTable = ({ companies, onCompanyClick, onCompanyDelete, onCompanyStatusUpdate, currentAdmin }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to handle categories display
  const getCategoriesDisplay = (categories) => {
    // If categories is already an array, return it
    if (Array.isArray(categories)) {
      return categories;
    }
    
    // If categories is a string, try to parse it or use as single item
    if (typeof categories === 'string') {
      // Try to parse as JSON array first
      try {
        const parsed = JSON.parse(categories);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // If not JSON, treat as single category string
        return [categories];
      }
    }
    
    // Fallback
    return ['N/A'];
  };

  const handleDelete = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(companyId);
    try {
      await companyAPI.delete(companyId);
      onCompanyDelete(companyId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete company. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (companyId, newStatus) => {
    setUpdatingStatus(companyId);
    try {
      await companyAPI.updateStatus(companyId, newStatus);
      onCompanyStatusUpdate(companyId, newStatus);
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'pending', label: 'Pending' },
      approved: { class: 'approved', label: 'Approved' },
      rejected: { class: 'rejected', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (companies.length === 0) {
    return (
      <div className="no-companies">
        <div className="no-data-icon">🏢</div>
        <h3>No companies found</h3>
        <p>No companies have registered yet.</p>
      </div>
    );
  }

  return (
    <div className="company-table-container">
      <div className="table-header">
        <h3>Registered Companies ({companies.length})</h3>
        <p className="admin-role-info">
          Access Level: <strong>{currentAdmin.role === 'super_admin' ? 'Full Access' : 'Limited View'}</strong>
        </p>
      </div>
      
      <div className="table-wrapper">
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              {currentAdmin.role === 'super_admin' && <th>Mobile</th>}
              {currentAdmin.role === 'super_admin' && <th>Email</th>}
              <th>Required Candidates</th>
              <th>Category</th> {/* Changed from Categories to Category */}
              <th>Status</th>
              <th>Registered On</th>
              {currentAdmin.role === 'super_admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => {
              const displayCategories = getCategoriesDisplay(company.categories);
              
              return (
                <tr key={company.id} className="company-row">
                  <td className="company-name">
                    <span className="name-text">{company.companyName}</span>
                  </td>
                  
                  <td>{company.contactPerson}</td>
                  
                  {currentAdmin.role === 'super_admin' && (
                    <td>{company.mobile}</td>
                  )}
                  
                  {currentAdmin.role === 'super_admin' && (
                    <td>{company.email}</td>
                  )}
                  
                  <td>
                    <span className="candidate-count">
                      {company.candidateQuantity}
                    </span>
                  </td>
                  
                  <td>
                    <div className="categories-list">
                      {displayCategories.slice(0, 2).map((category, index) => (
                        <span key={index} className="category-tag">
                          {category}
                        </span>
                      ))}
                      {displayCategories.length > 2 && (
                        <span className="more-categories">+{displayCategories.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    {getStatusBadge(company.registrationStatus)}
                    {currentAdmin.role === 'super_admin' && (
                      <select 
                        value={company.registrationStatus}
                        onChange={(e) => handleStatusUpdate(company.id, e.target.value)}
                        disabled={updatingStatus === company.id}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    )}
                  </td>
                  
                  <td>{formatDate(company.registrationDate)}</td>
                  
                  {currentAdmin.role === 'super_admin' && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => onCompanyClick(company)}
                          className="view-details-btn"
                        >
                          <span className="btn-icon">👁️</span>
                          Details
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(company.id, company.companyName)}
                          disabled={deletingId === company.id}
                          className="delete-btn"
                        >
                          {deletingId === company.id ? (
                            <>
                              <div className="button-spinner"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <span className="btn-icon">🗑️</span>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;