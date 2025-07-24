import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Use window.location to ensure full page reload
      window.location.href = '/login?session_expired=true';
    }
    
    return Promise.reject(error);
  }
);
export default API;