import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('glowroot_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API endpoints
export const getContent = () => api.get('/content');
export const getServices = (activeOnly = false) =>
  api.get(`/services${activeOnly ? '?active=true' : ''}`);
export const getServiceById = (id) => api.get(`/services/${id}`);
export const getPortfolio = (category = 'All', featured = false) => {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (featured) params.append('featured', 'true');
  return api.get(`/portfolio?${params.toString()}`);
};
export const getPortfolioById = (id) => api.get(`/portfolio/${id}`);
export const submitBooking = (bookingData) => api.post('/bookings', bookingData);
export const submitFeedback = (feedbackData) => api.post('/content/feedback', feedbackData);

// Admin API endpoints
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const getAdminProfile = () => api.get('/auth/me');
export const logoutAdmin = () => api.post('/auth/logout');

export const getAdminStats = () => api.get('/content/stats');
export const updateContent = (contentData) => api.put('/content', contentData);

export const createService = (serviceData) => api.post('/services', serviceData);
export const updateService = (id, serviceData) => api.put(`/services/${id}`, serviceData);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const createPortfolio = (portfolioData) => api.post('/portfolio', portfolioData);
export const updatePortfolio = (id, portfolioData) => api.put(`/portfolio/${id}`, portfolioData);
export const deletePortfolio = (id) => api.delete(`/portfolio/${id}`);
export const reorderPortfolio = (orderedIds) => api.put('/portfolio/reorder', { orderedIds });

export const getBookings = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.date) query.append('date', params.date);
  if (params.search) query.append('search', params.search);
  return api.get(`/bookings?${query.toString()}`);
};
export const updateBookingStatus = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export const uploadImage = (formData) =>
  api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;
