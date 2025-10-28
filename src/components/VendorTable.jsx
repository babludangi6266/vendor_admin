import React from 'react';
import './VendorTable.css';

const VendorTable = ({ vendors, onVendorClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (vendors.length === 0) {
    return (
      <div className="no-vendors">
        <div className="no-data-icon">📝</div>
        <h3>No vendors found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="vendor-table-container">
      <div className="table-header">
        <h3>Registered Vendors ({vendors.length})</h3>
      </div>
      
      <div className="table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Service Category</th>
              <th>Rate</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="vendor-row">
                <td className="vendor-name" onClick={() => onVendorClick(vendor)}>
                  <span className="name-text">{vendor.name}</span>
                </td>
                <td>{vendor.contact}</td>
                <td>{vendor.email || 'N/A'}</td>
                <td>
                  <span className={`category-badge ${vendor.serviceCategory}`}>
                    {formatCategory(vendor.serviceCategory)}
                  </span>
                </td>
                <td>
                  {vendor.rate ? (
                    <span className="rate">
                      ${vendor.rate} {vendor.rateType === 'hourly' ? '/hr' : '/job'}
                    </span>
                  ) : (
                    <span className="no-rate">Not set</span>
                  )}
                </td>
                <td>{formatDate(vendor.registrationDate)}</td>
                <td>
                  <button 
                    onClick={() => onVendorClick(vendor)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorTable;