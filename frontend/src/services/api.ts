import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// ── Public Endpoints & Caching ──────────────────────────────────
const cache = new Map<string, Promise<any>>();

export const fetchPizzas = () => {
  if (!cache.has('/pizzas')) {
    cache.set('/pizzas', api.get('/pizzas'));
  }
  return cache.get('/pizzas')!;
};

export const fetchLandingContent = () => {
  if (!cache.has('/content')) {
    cache.set('/content', api.get('/content'));
  }
  return cache.get('/content')!;
};
export const placeOrder = (orderData: object) => api.post('/orders', orderData);

// ── Admin Endpoints (JWT protected) ─────────────────────────────
export const adminLogin = (credentials: { username: string; password: string }) =>
  api.post('/auth/login', credentials);

export const fetchOrders = () => api.get('/orders');
export const updateOrderStage = (id: string, stage: string) =>
  api.patch(`/orders/${id}/stage`, { stage });

export const fetchCustomers = () => api.get('/customers');
export const fetchStaff = () => api.get('/staff');
export const createStaff = (data: object) => api.post('/staff', data);

export const fetchCoupons = () => api.get('/coupons');
export const createCoupon = (data: object) => api.post('/coupons', data);

export const fetchAnalytics = () => api.get('/analytics');

export default api;
