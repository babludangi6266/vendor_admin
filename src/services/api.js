// import axios from 'axios';

// const getApiBaseUrl = () => {
//   if (window.location.hostname === 'vendor-admin-snowy.vercel.app') {
//     //return 'https://vendor-backend-4v8l.onrender.com/api';
//     return 'http://localhost:5000/api';
//   }
//   if (window.location.hostname === 'localhost') {
//     return 'http://localhost:5000/api';
//   }
//   //return 'https://vendor-backend-4v8l.onrender.com/api';
//   return 'http://localhost:5000/api';
// };

// const API_BASE_URL = getApiBaseUrl();

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // Helper function to get admin data
// const getAdminData = () => {
//   try {
//     const adminData = localStorage.getItem('adminData');
//     return adminData ? JSON.parse(adminData) : null;
//   } catch (error) {
//     console.error('Error parsing admin data:', error);
//     return null;
//   }
// };

// // Request interceptor to add admin ID
// api.interceptors.request.use((config) => {
//   const adminData = getAdminData();
//   console.log('Admin data from localStorage:', adminData); // Debug log
  
//   if (adminData && adminData.id) {
//     config.headers['admin-id'] = adminData.id;
//     console.log('Setting admin-id header:', adminData.id); // Debug log
//   } else {
//     console.warn('No admin data found in localStorage'); // Debug log
//   }
  
//   console.log('Request headers:', config.headers); // Debug log
//   return config;
// });

// // Response interceptor for better error handling
// api.interceptors.response.use(
//   (response) => {
//     console.log('Response received:', response.status); // Debug log
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', {
//       status: error.response?.status,
//       message: error.response?.data?.message,
//       url: error.config?.url
//     });
    
//     if (error.response?.status === 401) {
//       console.error('Authentication failed - redirecting to login');
//       // Clear invalid admin data
//       localStorage.removeItem('adminData');
//       // You might want to redirect to login page here
//       window.location.href = '/';
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Admin API calls
// export const adminAPI = {
//   login: (credentials) => api.post('/admin/login', credentials),
//   getAll: () => api.get('/admin'),
//   create: (adminData) => api.post('/admin/create', adminData),
//   update: (id, adminData) => api.put(`/admin/${id}`, adminData),
//   delete: (id) => api.delete(`/admin/${id}`),
// };

// // Vendor API calls
// export const vendorAPI = {
//   getAll: () => api.get('/vendors'),
//   delete: (id) => api.delete(`/vendors/${id}`),
//   register: (vendorData) => api.post('/vendors/register', vendorData),
// };

// export default api;

import axios from 'axios';

const getApiBaseUrl = () => {
  if (window.location.hostname === 'vendor-admin-snowy.vercel.app') {
    return 'https://vendor-backend-4v8l.onrender.com/api';
  }
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return 'https://vendor-backend-4v8l.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper function to get admin data
const getAdminData = () => {
  try {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
};

// Request interceptor to add admin ID
api.interceptors.request.use((config) => {
  const adminData = getAdminData();
  
  if (adminData && adminData.id) {
    config.headers['admin-id'] = adminData.id;
  }
  
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login');
      localStorage.removeItem('adminData');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

// Admin API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getAll: () => api.get('/admin'),
  create: (adminData) => api.post('/admin/create', adminData),
  update: (id, adminData) => api.put(`/admin/${id}`, adminData),
  delete: (id) => api.delete(`/admin/${id}`),
};

// Candidate API calls
export const candidateAPI = {
  getAll: () => api.get('/candidates'),
  delete: (id) => api.delete(`/candidates/${id}`),
  updateStatus: (id, status) => api.put(`/candidates/${id}/status`, { registrationStatus: status }),
};

// Company API calls
export const companyAPI = {
  getAll: () => api.get('/companies'),
  delete: (id) => api.delete(`/companies/${id}`),
  updateStatus: (id, status) => api.put(`/companies/${id}/status`, { registrationStatus: status }),
};

export default api;