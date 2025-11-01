import React, { useState, useEffect } from 'react';
import { candidateAPI, companyAPI } from '../services/api';
import { exportToExcel } from '../utils/exportToExcel';
import StatsCards from './StatsCards.jsx';
import CandidateTable from './CandidateTable.jsx';
import CompanyTable from './CompanyTable.jsx';
import CandidateModal from './CandidateModal.jsx';
import CompanyModal from './CompanyModal.jsx';
import Charts from './Charts.jsx';
import AdminManagement from './AdminManagement.jsx';
import '../styles/Dashboard.css';

const Dashboard = ({ admin, onLogout }) => {
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataType, setDataType] = useState('candidates');

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: 'all',
    status: 'all',
    dateRange: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesResponse, companiesResponse] = await Promise.all([
        candidateAPI.getAll(),
        companyAPI.getAll()
      ]);
      
      if (candidatesResponse.data.success) {
        setCandidates(candidatesResponse.data.candidates);
      }
      if (companiesResponse.data.success) {
        setCompanies(companiesResponse.data.companies);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filter options
  const getUniqueCategories = () => {
    if (dataType === 'candidates') {
      return ['all', ...new Set(candidates.map(candidate => candidate.category).filter(Boolean))];
    } else {
      const allCategories = companies.flatMap(company => company.categories || []);
      return ['all', ...new Set(allCategories)].filter(Boolean);
    }
  };

  const getUniqueLocations = () => {
    if (dataType === 'candidates') {
      return ['all', ...new Set(candidates.map(candidate => candidate.jobLocationCity).filter(Boolean))];
    } else {
      const locations = companies.map(company => company.jobLocation?.city).filter(Boolean);
      return ['all', ...new Set(locations)];
    }
  };

  // Filter data based on current filters
  const filterData = (data) => {
    return data.filter(item => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          item.fullName?.toLowerCase().includes(searchTerm) ||
          item.companyName?.toLowerCase().includes(searchTerm) ||
          item.email?.toLowerCase().includes(searchTerm) ||
          item.mobile?.includes(searchTerm) ||
          item.contactPerson?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all') {
        if (dataType === 'candidates') {
          if (item.category !== filters.category) return false;
        } else {
          if (!item.categories?.includes(filters.category)) return false;
        }
      }

      // Location filter
      if (filters.location !== 'all') {
        if (dataType === 'candidates') {
          if (item.jobLocationCity !== filters.location) return false;
        } else {
          if (item.jobLocation?.city !== filters.location) return false;
        }
      }

      // Status filter
      if (filters.status !== 'all') {
        if (item.registrationStatus !== filters.status) return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.registrationDate);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (filters.dateRange) {
          case 'today':
            const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
            if (itemDay.getTime() !== today.getTime()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (itemDate < monthAgo) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  };

  const filteredCandidates = filterData(candidates);
  const filteredCompanies = filterData(companies);

  const handleCandidateDelete = (deletedId) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== deletedId));
  };

  const handleCompanyDelete = (deletedId) => {
    setCompanies(prev => prev.filter(company => company.id !== deletedId));
  };

  const handleCandidateStatusUpdate = (candidateId, newStatus) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, registrationStatus: newStatus }
        : candidate
    ));
  };

  const handleCompanyStatusUpdate = (companyId, newStatus) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, registrationStatus: newStatus }
        : company
    ));
  };

  const handleExportExcel = () => {
    const dataToExport = dataType === 'candidates' ? filteredCandidates : filteredCompanies;
    const filename = dataType === 'candidates' ? 'workforce_candidates' : 'workforce_companies';
    exportToExcel(dataToExport, filename, dataType);
  };

  const handleCandidateClick = (candidate) => {
    if (admin.role === 'super_admin') {
      setSelectedCandidate(candidate);
      setIsCandidateModalOpen(true);
    }
  };

  const handleCompanyClick = (company) => {
    if (admin.role === 'super_admin') {
      setSelectedCompany(company);
      setIsCompanyModalOpen(true);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
      status: 'all',
      dateRange: 'all'
    });
  };

  const currentData = dataType === 'candidates' ? filteredCandidates : filteredCompanies;
  const totalData = dataType === 'candidates' ? candidates.length : companies.length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="welcome-section">
              <h1>WorkForce Connect Admin</h1>
              <div className="user-info">
                <span className="user-greeting">Welcome back, {admin.name}!</span>
                <span className={`user-role ${admin.role}`}>
                  {admin.role === 'super_admin' ? '👑 Super Admin' : '👤 Admin'}
                </span>
              </div>
              {admin.role === 'admin' && (
                <div className="access-info">
                  <span className="info-icon">ℹ️</span>
                  Limited access mode - Viewing basic information
                </div>
              )}
            </div>
          </div>
          <div className="header-actions">
            <div className="data-type-toggle">
              <button 
                onClick={() => setDataType('candidates')}
                className={`toggle-btn ${dataType === 'candidates' ? 'active' : ''}`}
              >
                👨‍🎓 Candidates
              </button>
              <button 
                onClick={() => setDataType('companies')}
                className={`toggle-btn ${dataType === 'companies' ? 'active' : ''}`}
              >
                🏢 Companies
              </button>
            </div>

            {admin.role === 'super_admin' && (
              <button onClick={handleExportExcel} className="export-btn">
                <span className="btn-icon">📊</span>
                Export Excel
              </button>
            )}
            
            {admin.role === 'super_admin' && (
              <button 
                onClick={() => setActiveTab(activeTab === 'admins' ? 'dashboard' : 'admins')}
                className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
              >
                {activeTab === 'admins' ? '📋 Back to Dashboard' : '👥 Manage Admins'}
              </button>
            )}
            
            <button onClick={onLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {activeTab === 'admins' ? (
          <AdminManagement currentAdmin={admin} />
        ) : (
          <>
            <StatsCards 
              candidates={candidates} 
              companies={companies} 
              dataType={dataType}
            />

            <Charts 
              candidates={candidates} 
              companies={companies} 
              dataType={dataType}
            />

            {/* Filters Section */}
            <div className="filters-section">
              <div className="filters-header">
                <h2>
                  {dataType === 'candidates' ? 'Candidates' : 'Companies'}
                  <span className="results-count">
                    ({currentData.length} of {totalData} {dataType})
                  </span>
                </h2>
                <div className="filters-controls">
                  <button 
                    className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <span className="btn-icon">🔍</span>
                    Filters
                    {Object.values(filters).some(filter => filter !== 'all' && filter !== '') && (
                      <span className="active-filters-dot"></span>
                    )}
                  </button>
                  {(Object.values(filters).some(filter => filter !== 'all' && filter !== '') || showFilters) && (
                    <button onClick={resetFilters} className="reset-filters-btn">
                      <span className="btn-icon">🔄</span>
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="filters-panel">
                  <div className="filter-group">
                    <label>Search</label>
                    <input
                      type="text"
                      placeholder={`Search ${dataType} by name, email, or phone...`}
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                      className="filter-select"
                    >
                      <option value="all">All Categories</option>
                      {getUniqueCategories().filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                      className="filter-select"
                    >
                      <option value="all">All Locations</option>
                      {getUniqueLocations().filter(loc => loc !== 'all').map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
                      className="filter-select"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {Object.values(filters).some(filter => filter !== 'all' && filter !== '') && (
                <div className="active-filters">
                  <span className="active-filters-label">Active filters:</span>
                  {filters.search && (
                    <span className="active-filter-tag">
                      Search: "{filters.search}"
                      <button onClick={() => setFilters(prev => ({...prev, search: ''}))}>×</button>
                    </span>
                  )}
                  {filters.category !== 'all' && (
                    <span className="active-filter-tag">
                      Category: {filters.category}
                      <button onClick={() => setFilters(prev => ({...prev, category: 'all'}))}>×</button>
                    </span>
                  )}
                  {filters.location !== 'all' && (
                    <span className="active-filter-tag">
                      Location: {filters.location}
                      <button onClick={() => setFilters(prev => ({...prev, location: 'all'}))}>×</button>
                    </span>
                  )}
                  {filters.status !== 'all' && (
                    <span className="active-filter-tag">
                      Status: {filters.status}
                      <button onClick={() => setFilters(prev => ({...prev, status: 'all'}))}>×</button>
                    </span>
                  )}
                  {filters.dateRange !== 'all' && (
                    <span className="active-filter-tag">
                      Date: {filters.dateRange}
                      <button onClick={() => setFilters(prev => ({...prev, dateRange: 'all'}))}>×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {dataType === 'candidates' ? (
              <CandidateTable 
                candidates={filteredCandidates}
                onCandidateClick={handleCandidateClick}
                onCandidateDelete={handleCandidateDelete}
                onCandidateStatusUpdate={handleCandidateStatusUpdate}
                currentAdmin={admin}
              />
            ) : (
              <CompanyTable 
                companies={filteredCompanies}
                onCompanyClick={handleCompanyClick}
                onCompanyDelete={handleCompanyDelete}
                onCompanyStatusUpdate={handleCompanyStatusUpdate}
                currentAdmin={admin}
              />
            )}
          </>
        )}
      </div>

      {isCandidateModalOpen && admin.role === 'super_admin' && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setIsCandidateModalOpen(false)}
        />
      )}

      {isCompanyModalOpen && admin.role === 'super_admin' && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setIsCompanyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;