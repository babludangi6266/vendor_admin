import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://vendor-backend-0z0o.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
};

// Vendor API calls
export const vendorAPI = {
  getAll: () => api.get('/vendors'),
};

export default api;