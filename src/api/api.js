import axios from 'axios';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const API = axios.create({
  baseURL: '/auth', // Your backend proxy or direct route
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect explicitly to full frontend URL + /login
      window.location.href = `${FRONTEND_URL}/login?session_expired=true`;
    }
    return Promise.reject(error);
  }
);

export default API;
