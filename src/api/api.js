// src/api/api.js
import axios from 'axios';

export const BASE_URL = 'https://e-commerce-backend-production-909a.up.railway.app/api';


const API = axios.create({
  baseURL:BASE_URL,            // Use env variable for deployment, fallback to localhost for dev
  withCredentials: true, 
});

// Add request interceptor for token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
