import axios from 'axios';

// Get the current hostname from the browser and replace the port
const hostname = window.location.hostname;
// Replace the port number (3000) with 5000 in the hostname
const backendHostname = hostname.replace('-3000.', '-5000.');
// Construct the backend URL
const API_URL = `https://${backendHostname}/api`;
console.log('Backend API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Enhanced response interceptor for detailed logging and auth handling
api.interceptors.response.use(
  (response) => {
    console.log('API Success:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('Authentication error - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/#/login';
    }

    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const equipment = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};

export const borrowing = {
  getRequests: () => api.get('/borrow-requests'),
  create: (data) => api.post('/borrow-requests', data),
  updateStatus: (id, status) => api.put(`/borrow-requests/${id}/status`, { status }),
};

export default api;