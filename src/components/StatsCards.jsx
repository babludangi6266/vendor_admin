import React from 'react';
import '../styles/StatsCards.css';

const StatsCards = ({ candidates, companies, dataType }) => {
  const currentData = dataType === 'candidates' ? candidates : companies;
  const totalCount = currentData.length;

  const candidatesByCategory = candidates.reduce((acc, candidate) => {
    acc[candidate.category] = (acc[candidate.category] || 0) + 1;
    return acc;
  }, {});

  const topCandidateCategory = Object.entries(candidatesByCategory).sort((a, b) => b[1] - a[1])[0];

  const pendingCandidates = candidates.filter(c => c.registrationStatus === 'pending').length;
  const approvedCandidates = candidates.filter(c => c.registrationStatus === 'approved').length;
  const pendingCompanies = companies.filter(c => c.registrationStatus === 'pending').length;
  const approvedCompanies = companies.filter(c => c.registrationStatus === 'approved').length;

  if (dataType === 'candidates') {
    return (
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <span>👨‍🎓</span>
          </div>
          <div className="stat-info">
            <h3>{totalCount}</h3>
            <p>Total Candidates</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories">
            <span>📊</span>
          </div>
          <div className="stat-info">
            <h3>{Object.keys(candidatesByCategory).length}</h3>
            <p>Job Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <span>⏳</span>
          </div>
          <div className="stat-info">
            <h3>{pendingCandidates}</h3>
            <p>Pending Approval</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approved">
            <span>✅</span>
          </div>
          <div className="stat-info">
            <h3>{approvedCandidates}</h3>
            <p>Approved Candidates</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon total">
          <span>🏢</span>
        </div>
        <div className="stat-info">
          <h3>{totalCount}</h3>
          <p>Total Companies</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon categories">
          <span>📋</span>
        </div>
        <div className="stat-info">
          <h3>{new Set(companies.flatMap(c => c.categories)).size}</h3>
          <p>Unique Categories</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon pending">
          <span>⏳</span>
        </div>
        <div className="stat-info">
          <h3>{pendingCompanies}</h3>
          <p>Pending Approval</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon approved">
          <span>✅</span>
        </div>
        <div className="stat-info">
          <h3>{approvedCompanies}</h3>
          <p>Approved Companies</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

