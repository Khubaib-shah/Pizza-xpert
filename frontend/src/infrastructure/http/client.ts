import axios from 'axios';

// In dev, always use the Vite proxy path (/api) so requests are forwarded
// server-to-server, avoiding CORS. In production, VITE_API_URL is injected at build time.
const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');

export const httpClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach the admin token if it exists
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global 401 unauthorized errors
httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);
