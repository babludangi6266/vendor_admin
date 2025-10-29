// import React, { useState, useEffect } from 'react';
// import { vendorAPI } from '../services/api';
// import { exportToExcel } from '../utils/exportToExcel';
// import StatsCards from './StatsCards';
// import VendorTable from './VendorTable';
// import VendorModal from './VendorModal';
// import Charts from './Charts';
// import '../styles/Dashboard.css';

// const Dashboard = ({ admin, onLogout }) => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const fetchVendors = async () => {
//     try {
//       const response = await vendorAPI.getAll();
//       if (response.data.success) {
//         setVendors(response.data.vendors);
//       }
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter vendors based on category and search
//   const filteredVendors = vendors.filter(vendor => {
//     const matchesCategory = filter === 'all' || vendor.serviceCategory === filter;
//     const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          vendor.contact.includes(searchTerm) ||
//                          vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleVendorClick = (vendor) => {
//     setSelectedVendor(vendor);
//     setIsModalOpen(true);
//   };

//   const handleExportExcel = () => {
//     exportToExcel(filteredVendors, 'workforce_vendors');
//   };

//   const serviceCategories = ['all', ...new Set(vendors.map(v => v.serviceCategory))];

//   if (loading) {
//     return (
//       <div className="dashboard-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <div className="header-left">
//             <h1>Workforce Admin Dashboard</h1>
//             <p>Welcome back, {admin.name}!</p>
//           </div>
//           <div className="header-actions">
//             <button onClick={handleExportExcel} className="export-btn">
//               Export to Excel
//             </button>
//             <button onClick={onLogout} className="logout-btn">
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="dashboard-content">
//         {/* Stats Cards */}
//         <StatsCards vendors={vendors} />

//         {/* Charts Section */}
//         <Charts vendors={vendors} />

//         {/* Filters and Search */}
//         <div className="filters-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search vendors by name, contact, or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>
//           <div className="category-filters">
//             <label>Filter by Service:</label>
//             <select 
//               value={filter} 
//               onChange={(e) => setFilter(e.target.value)}
//               className="filter-select"
//             >
//               {serviceCategories.map(category => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Vendors Table */}
//         <VendorTable 
//           vendors={filteredVendors}
//           onVendorClick={handleVendorClick}
//         />
//       </div>

//       {/* Vendor Details Modal */}
//       {isModalOpen && (
//         <VendorModal
//           vendor={selectedVendor}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { vendorAPI } from '../services/api';
import { exportToExcel } from '../utils/exportToExcel';
import StatsCards from './StatsCards';
import VendorTable from './VendorTable';
import VendorModal from './VendorModal';
import Charts from './Charts';
import '../styles/Dashboard.css';

const Dashboard = ({ admin, onLogout }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getAll();
      if (response.data.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle vendor deletion
  const handleVendorDelete = (deletedVendorId) => {
    setVendors(prevVendors => prevVendors.filter(vendor => vendor.id !== deletedVendorId));
  };

  // Filter vendors based on category and search
  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = filter === 'all' || vendor.serviceCategory === filter;
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact.includes(searchTerm) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredVendors, 'workforce_vendors');
  };

  const serviceCategories = ['all', ...new Set(vendors.map(v => v.serviceCategory))];

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
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Workforce Admin Dashboard</h1>
            <p>Welcome back, {admin.name}!</p>
          </div>
          <div className="header-actions">
            <button onClick={handleExportExcel} className="export-btn">
              Export to Excel
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <StatsCards vendors={vendors} />

        {/* Charts Section */}
        <Charts vendors={vendors} />

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search vendors by name, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filters">
            <label>Filter by Service:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              {serviceCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendors Table */}
        <VendorTable 
          vendors={filteredVendors}
          onVendorClick={handleVendorClick}
          onVendorDelete={handleVendorDelete}
        />
      </div>

      {/* Vendor Details Modal */}
      {isModalOpen && (
        <VendorModal
          vendor={selectedVendor}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;