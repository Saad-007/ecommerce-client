import axios from 'axios';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Remove localStorage token handling completely
API.interceptors.request.use((config) => {
  // No token needed - cookies are sent automatically
  return config;
});
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Prevent infinite reload if already on /login
      if (window.location.pathname !== '/login') {
        window.location.href = `${FRONTEND_URL}/login?session_expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default API;
