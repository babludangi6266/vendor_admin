import React from 'react';
import '../styles/CandidateModal.css';

const CandidateModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Get photo URL - handle both local and production paths
  const getPhotoUrl = () => {
    if (!candidate.photo) return null;
    
    if (candidate.photo.startsWith('http')) {
      return candidate.photo;
    } else {
      // For local development - adjust the base URL as needed
      const baseUrl = 'https://vendor-backend-5zph.onrender.com';
      return `${baseUrl}/uploads/candidates/${candidate.photo}`;
    }
  };

  const photoUrl = getPhotoUrl();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Candidate Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Photo Section */}
          {photoUrl && (
            <div className="details-section photo-section">
              <h3>Photo</h3>
              <div className="photo-display">
                <img src={photoUrl} alt="Candidate" className="candidate-photo" />
                <div className="photo-info">
                  <p><strong>File:</strong> {candidate.photo}</p>
                  <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="view-full-btn">
                    View Full Image
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{candidate.fullName}</p>
              </div>
              <div className="detail-item">
                <label>Mobile Number</label>
                <p>{candidate.mobile}</p>
              </div>
              <div className="detail-item">
                <label>Email Address</label>
                <p>{candidate.email || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>Mobile Verified</label>
                <p>{candidate.isMobileVerified ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="details-section">
            <h3>Address Information</h3>
            <div className="details-grid">
              <div className="detail-item full-width">
                <label>Village/Town/City</label>
                <p>{candidate.address?.villageTownCity || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Landmark</label>
                <p>{candidate.address?.landmark || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>PIN Code</label>
                <p>{candidate.address?.pincode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="details-section">
            <h3>Professional Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Job Category</label>
                <p className="category-text">{candidate.category}</p>
              </div>
              <div className="detail-item">
                <label>Preferred Job Location</label>
                <p>{candidate.jobLocationCity}</p>
              </div>
              {candidate.customCity && (
                <div className="detail-item">
                  <label>Custom City</label>
                  <p>{candidate.customCity}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="details-section">
            <h3>Payment Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Registration Fee</label>
                <p>₹{candidate.registrationFee || '500.00'}</p>
              </div>
              <div className="detail-item">
                <label>Payment Status</label>
                <p className={`payment-status ${candidate.paymentStatus || 'pending'}`}>
                  {candidate.paymentStatus || 'pending'}
                </p>
              </div>
              {candidate.upiTransactionId && (
                <div className="detail-item">
                  <label>UPI Transaction ID</label>
                  <p className="transaction-id">{candidate.upiTransactionId}</p>
                </div>
              )}
              {candidate.uidNumber && (
                <div className="detail-item">
                  <label>UID Number</label>
                  <p>{candidate.uidNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Registration Information */}
          <div className="details-section">
            <h3>Registration Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Registration Status</label>
                <div className="status-with-badge">
                  {getStatusBadge(candidate.registrationStatus)}
                </div>
              </div>
              <div className="detail-item">
                <label>Registration Date</label>
                <p>{formatDate(candidate.registrationDate)}</p>
              </div>
              <div className="detail-item">
                <label>Candidate ID</label>
                <p className="candidate-id">{candidate.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;