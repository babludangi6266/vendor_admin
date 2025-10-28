import React from 'react';
import './VendorModal.css';

const VendorModal = ({ vendor, onClose }) => {
  if (!vendor) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vendor Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Personal Information */}
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{vendor.name}</p>
              </div>
              <div className="detail-item">
                <label>Contact Number</label>
                <p>{vendor.contact}</p>
              </div>
              <div className="detail-item">
                <label>Email Address</label>
                <p>{vendor.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="details-section">
            <h3>Address</h3>
            <div className="detail-item full-width">
              <label>Complete Address</label>
              <p className="address-text">{vendor.address}</p>
            </div>
          </div>

          {/* Service Information */}
          <div className="details-section">
            <h3>Service Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Service Category</label>
                <p>
                  <span className={`category-badge ${vendor.serviceCategory}`}>
                    {formatCategory(vendor.serviceCategory)}
                  </span>
                </p>
              </div>
              <div className="detail-item">
                <label>Rate Type</label>
                <p>{vendor.rateType === 'hourly' ? 'Hourly' : 'Per Job'}</p>
              </div>
              <div className="detail-item">
                <label>Rate</label>
                <p>
                  {vendor.rate ? (
                    <span className="rate-amount">
                      ${vendor.rate} {vendor.rateType === 'hourly' ? '/hour' : '/job'}
                    </span>
                  ) : (
                    <span className="no-rate">Not specified</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="details-section">
            <h3>Registration Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Registration Date</label>
                <p>{formatDate(vendor.registrationDate)}</p>
              </div>
              <div className="detail-item">
                <label>Vendor ID</label>
                <p className="vendor-id">{vendor._id}</p>
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

export default VendorModal;