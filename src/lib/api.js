import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
} );

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  registerOwner: (data) => api.post('/auth/register/owner', data),
  registerClient: (data) => api.post('/auth/register/client', data),
  loginOwner: (data) => api.post('/auth/login/owner', data),
  loginClient: (data) => api.post('/auth/login/client', data),
  verifyToken: () => api.post('/auth/verify-token'),
};

// Gym Management API
export const gymAPI = {
  createGym: (data) => api.post('/gym', data),
  getGym: () => api.get('/gym'),
  updateGym: (data) => api.put('/gym', data),
  createMachine: (data) => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.post('/gym/machines', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/gym/machines', data);
  },
  getMachines: () => api.get('/gym/machines'),
  updateMachine: (id, data) => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.put(`/gym/machines/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/gym/machines/${id}`, data);
  },
  deleteMachine: (id) => api.delete(`/gym/machines/${id}`),
};

// QR Code API
export const qrAPI = {
  generateQR: (machineId) => api.post(`/qr/generate/${machineId}`),
  getQRImage: (machineId) => api.get(`/qr/image/${machineId}`, { responseType: 'blob' }),
  // REVERTED: Send token as a JSON object again
  scanQR: (token) => api.post('/qr/scan', { token }),
  validateToken: (token) => api.get(`/qr/validate/${token}`),
};

// Client Features API
export const clientAPI = {
  bookmarkMachine: (machineId) => api.post('/client/bookmarks', { machine_id: machineId }),
  getBookmarks: () => api.get('/client/bookmarks'),
  removeBookmark: (machineId) => api.delete(`/client/bookmarks/${machineId}`),
  getScanHistory: (page = 1, perPage = 20) => api.get(`/client/scan-history?page=${page}&per_page=${perPage}`),
  getMachineDetails: (machineId) => api.get(`/client/machine/${machineId}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (days = 30) => api.get(`/analytics/overview?days=${days}`),
  getMachineUsage: (days = 30) => api.get(`/analytics/machine-usage?days=${days}`),
  getDailyScans: (days = 30) => api.get(`/analytics/daily-scans?days=${days}`),
  getPopularMachines: (limit = 5, days = 30) => api.get(`/analytics/popular-machines?limit=${limit}&days=${days}`),
};

export default api;
