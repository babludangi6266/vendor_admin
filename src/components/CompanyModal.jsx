import React, { useState } from 'react';
import '../styles/CompanyModal.css';

const CompanyModal = ({ company, onClose }) => {
  if (!company) return null;

  const [viewFullDocument, setViewFullDocument] = useState(false);

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

  // Get document URL - handle both local and production paths
  const getDocumentUrl = () => {
    if (!company.businessDocument) return null;
    
    if (company.businessDocument.startsWith('http')) {
      return company.businessDocument;
    } else {
      // For local development - adjust the base URL as needed
      const baseUrl = 'https://vendor-backend-4v8l.onrender.com';
      return `${baseUrl}/uploads/companies/${company.businessDocument}`;
    }
  };

  const documentUrl = getDocumentUrl();
  const isImage = company.businessDocument?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = company.businessDocument?.match(/\.pdf$/i);

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = company.businessDocument;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Company Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Document Section */}
          {documentUrl && (
            <div className="details-section document-section">
              <h3>Business Document</h3>
              <div className="document-display">
                <div className="document-preview">
                  {isImage ? (
                    <div className="image-preview">
                      <img 
                        src={documentUrl} 
                        alt="Business Document" 
                        className="document-image"
                        onClick={() => setViewFullDocument(true)}
                      />
                      <div className="document-actions">
                        <button 
                          className="view-full-btn"
                          onClick={() => setViewFullDocument(true)}
                        >
                          🔍 View Full Image
                        </button>
                        <button 
                          className="download-btn"
                          onClick={handleDownload}
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>
                  ) : isPDF ? (
                    <div className="pdf-preview">
                      <div className="pdf-icon">📄</div>
                      <div className="pdf-info">
                        <h4>PDF Document</h4>
                        <p>{company.businessDocument}</p>
                        <div className="document-actions">
                          <a 
                            href={documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-full-btn"
                          >
                            👁️ View PDF
                          </a>
                          <button 
                            className="download-btn"
                            onClick={handleDownload}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="file-preview">
                      <div className="file-icon">📎</div>
                      <div className="file-info">
                        <h4>Document File</h4>
                        <p>{company.businessDocument}</p>
                        <div className="document-actions">
                          <a 
                            href={documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-full-btn"
                          >
                            👁️ View Document
                          </a>
                          <button 
                            className="download-btn"
                            onClick={handleDownload}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="document-details">
                  <p><strong>File Name:</strong> {company.businessDocument}</p>
                  <p><strong>File Type:</strong> {isImage ? 'Image' : isPDF ? 'PDF' : 'Document'}</p>
                  <p><strong>Uploaded:</strong> {formatDate(company.registrationDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="details-section">
            <h3>Company Information</h3>
            <div className="details-grid">
              <div className="detail-item full-width">
                <label>Company Name</label>
                <p>{company.companyName}</p>
              </div>
              <div className="detail-item">
                <label>Contact Person</label>
                <p>{company.contactPerson}</p>
              </div>
              <div className="detail-item">
                <label>Mobile Number</label>
                <p>{company.mobile}</p>
              </div>
              <div className="detail-item">
                <label>Email Address</label>
                <p>{company.email}</p>
              </div>
              <div className="detail-item">
                <label>Mobile Verified</label>
                <p>{company.isMobileVerified ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          </div>

          {/* Company Address */}
          <div className="details-section">
            <h3>Company Address</h3>
            <div className="details-grid">
              <div className="detail-item full-width">
                <label>Street Address</label>
                <p>{company.address?.street || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>City</label>
                <p>{company.address?.city || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>State</label>
                <p>{company.address?.state || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>PIN Code</label>
                <p>{company.address?.pincode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Business Requirements */}
          <div className="details-section">
            <h3>Business Requirements</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Required Categories</label>
                <div className="categories-list">
                  {Array.isArray(company.categories) ? (
                    company.categories.map((category, index) => (
                      <span key={index} className="category-tag">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span>No categories specified</span>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <label>Candidate Quantity Needed</label>
                <p className="quantity-text">{company.candidateQuantity}</p>
              </div>
              <div className="detail-item full-width">
                <label>Experience Required</label>
                <p>
                  {company.experience?.years || 0} years, 
                  {company.experience?.months || 0} months, 
                  {company.experience?.days || 0} days
                </p>
              </div>
            </div>
          </div>

          {/* Job Location */}
          <div className="details-section">
            <h3>Job Location</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>City</label>
                <p>{company.jobLocation?.city || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>State</label>
                <p>{company.jobLocation?.state || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="details-section">
            <h3>Registration Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Registration Status</label>
                <div className="status-with-badge">
                  {getStatusBadge(company.registrationStatus)}
                </div>
              </div>
              <div className="detail-item">
                <label>Registration Date</label>
                <p>{formatDate(company.registrationDate)}</p>
              </div>
              <div className="detail-item">
                <label>Company ID</label>
                <p className="company-id">{company.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-btn">
            Close
          </button>
        </div>

        {/* Full Document Viewer Modal */}
        {viewFullDocument && isImage && (
          <div className="full-document-overlay" onClick={() => setViewFullDocument(false)}>
            <div className="full-document-content" onClick={(e) => e.stopPropagation()}>
              <div className="full-document-header">
                <h3>Business Document - {company.businessDocument}</h3>
                <button 
                  className="close-full-btn"
                  onClick={() => setViewFullDocument(false)}
                >
                  ×
                </button>
              </div>
              <div className="full-document-body">
                <img src={documentUrl} alt="Business Document" className="full-document-image" />
              </div>
              <div className="full-document-footer">
                <button onClick={handleDownload} className="download-full-btn">
                  📥 Download Image
                </button>
                <button 
                  onClick={() => setViewFullDocument(false)}
                  className="close-full-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModal;