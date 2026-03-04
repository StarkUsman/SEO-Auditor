import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://seoscrapper.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 21600000, // 6 hours for large crawls
});

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
