import React, { useState } from 'react';
import { candidateAPI } from '../services/api';
import '../styles/CandidateTable.css';

const CandidateTable = ({ candidates, onCandidateClick, onCandidateDelete, onCandidateStatusUpdate, currentAdmin }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete "${candidateName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(candidateId);
    try {
      await candidateAPI.delete(candidateId);
      onCandidateDelete(candidateId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete candidate. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    setUpdatingStatus(candidateId);
    try {
      await candidateAPI.updateStatus(candidateId, newStatus);
      onCandidateStatusUpdate(candidateId, newStatus);
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

  if (candidates.length === 0) {
    return (
      <div className="no-candidates">
        <div className="no-data-icon">👨‍🎓</div>
        <h3>No candidates found</h3>
        <p>No candidates have registered yet.</p>
      </div>
    );
  }

  return (
    <div className="candidate-table-container">
      <div className="table-header">
        <h3>Registered Candidates ({candidates.length})</h3>
        <p className="admin-role-info">
          Access Level: <strong>{currentAdmin.role === 'super_admin' ? 'Full Access' : 'Limited View'}</strong>
        </p>
      </div>
      
      <div className="table-wrapper">
        <table className="candidate-table">
          {/* <thead>
            <tr>
              <th>Name</th>
              {currentAdmin.role === 'super_admin' && <th>Mobile</th>}
              {currentAdmin.role === 'super_admin' && <th>Email</th>}
              <th>Category</th>
              <th>Job Location</th>
              <th>Status</th>
              <th>Registered On</th>
              {currentAdmin.role === 'super_admin' && <th>Actions</th>}
            </tr>
          </thead> */}
          <thead>
  <tr>
    <th>Photo</th>
    <th>Name</th>
    {currentAdmin.role === 'super_admin' && <th>Mobile</th>}
    {currentAdmin.role === 'super_admin' && <th>Email</th>}
    <th>Category</th>
    <th>Job Location</th>
    <th>Status</th>
    <th>Registered On</th>
    {currentAdmin.role === 'super_admin' && <th>Actions</th>}
  </tr>
</thead>

          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="candidate-row">
                <td className="photo-thumbnail">
        {candidate.photo ? (
          <img 
            src={`https://vendor-backend-4v8l.onrender.com/uploads/candidates/${candidate.photo}`} 
            alt="Candidate" 
            className="thumbnail-img"
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback image
            }}
          />
        ) : (
          <div className="no-photo">No Photo</div>
        )}
      </td>
                <td className="candidate-name">
                  <span className="name-text">{candidate.fullName}</span>
                </td>
                
                {currentAdmin.role === 'super_admin' && (
                  <td>{candidate.mobile}</td>
                )}
                
                {currentAdmin.role === 'super_admin' && (
                  <td>{candidate.email || 'N/A'}</td>
                )}
                
                <td>
                  <span className="category-badge">
                    {candidate.category}
                  </span>
                </td>
                <td>
                  {candidate.jobLocationCity}
                  {candidate.customCity && ` (${candidate.customCity})`}
                </td>
                <td>
                  {getStatusBadge(candidate.registrationStatus)}
                  {currentAdmin.role === 'super_admin' && (
                    <select 
                      value={candidate.registrationStatus}
                      onChange={(e) => handleStatusUpdate(candidate.id, e.target.value)}
                      disabled={updatingStatus === candidate.id}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                </td>
                <td>{formatDate(candidate.registrationDate)}</td>
                
                {currentAdmin.role === 'super_admin' && (
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => onCandidateClick(candidate)}
                        className="view-details-btn"
                      >
                        <span className="btn-icon">👁️</span>
                        Details
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(candidate.id, candidate.fullName)}
                        disabled={deletingId === candidate.id}
                        className="delete-btn"
                      >
                        {deletingId === candidate.id ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;