import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://seoscrapper.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 21600000, // 6 hours for large crawls
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      localStorage.removeItem('token');
      // Reload to show login screen
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, name) => {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Existing API functions
export const runAudit = async (url, useJavaScript = true) => {
  const response = await api.post('/audit', { url, useJavaScript });
  return response.data;
};

export const runCrawl = async (url, maxPages = 10) => {
  const response = await api.post('/crawl', { url, maxPages });
  return response.data;
};

export const quickCheck = async (url) => {
  const response = await api.get('/quick-check', { params: { url } });
  return response.data;
};

export const optimizeContent = async ({ text, keywords, tone, contentType }) => {
  const response = await api.post('/optimize-content', { text, keywords, tone, contentType });
  return response.data;
};

export const optimizeWebsite = async ({ url, mode, geoOptions }) => {
  const response = await api.post('/optimize-website', { url, mode, geoOptions });
  return response.data;
};

export default api;
