import React from 'react';
import './StatsCards.css';

const StatsCards = ({ vendors }) => {
  const totalVendors = vendors.length;
  
  const vendorsByCategory = vendors.reduce((acc, vendor) => {
    acc[vendor.serviceCategory] = (acc[vendor.serviceCategory] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(vendorsByCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon total">
          <span>👥</span>
        </div>
        <div className="stat-info">
          <h3>{totalVendors}</h3>
          <p>Total Vendors</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon categories">
          <span>📊</span>
        </div>
        <div className="stat-info">
          <h3>{Object.keys(vendorsByCategory).length}</h3>
          <p>Service Categories</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon top">
          <span>⭐</span>
        </div>
        <div className="stat-info">
          <h3>{topCategory ? topCategory[1] : 0}</h3>
          <p>
            {topCategory 
              ? `${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)}` 
              : 'No Data'
            }
          </p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon rate">
          <span>💰</span>
        </div>
        <div className="stat-info">
          <h3>
            {vendors.filter(v => v.rate).length}
          </h3>
          <p>Vendors with Rates</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;