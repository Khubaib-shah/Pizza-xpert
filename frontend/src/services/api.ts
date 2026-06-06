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

export const fetchCategories = () => {
  if (!cache.has('/categories')) {
    cache.set('/categories', api.get('/categories'));
  }
  return cache.get('/categories')!;
};

export const fetchMenuConfig = () => {
  if (!cache.has('/menu-config')) {
    cache.set('/menu-config', api.get('/menu-config'));
  }
  return cache.get('/menu-config')!;
};
export const fetchHeroSlides = () => api.get('/hero-slides');

export const placeOrder = (orderData: object) => api.post('/orders', orderData);

// ── Admin Endpoints (JWT protected) ─────────────────────────────
export const adminLogin = (credentials: { username: string; password: string }) =>
  api.post('/auth/login', credentials);

export const fetchOrders = () => api.get('/orders');
export const updateOrderStage = (id: string, stage: string) =>
  api.patch(`/orders/${id}/stage`, { stage });

export const updateStaffStatus = (id: string, status: string) =>
  api.patch(`/staff/${id}/status`, { status });

// ── Gallery / Media Endpoints (Admin) ───────────────────────────
export const fetchGallery = (folder?: string) =>
  api.get('/gallery', { params: folder ? { folder } : {} });

export const uploadMedia = (formData: FormData) =>
  api.post('/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteMedia = (id: string) => api.delete(`/gallery/${id}`);

export const fetchCustomers = () => api.get('/customers');
export const fetchStaff = () => api.get('/staff');
export const createStaff = (data: object) => api.post('/staff', data);

export const fetchCoupons = () => api.get('/coupons');
export const createCoupon = (data: object) => api.post('/coupons', data);

export const fetchAnalytics = () => api.get('/analytics');

// ── Admin: Hero Slides ────────────────────────────────────────────
export const fetchHeroSlidesAdmin = () => api.get('/hero-slides/admin');
export const createHeroSlide = (data: object) => api.post('/hero-slides', data);
export const updateHeroSlide = (id: string, data: object) => api.put(`/hero-slides/${id}`, data);
export const deleteHeroSlide = (id: string) => api.delete(`/hero-slides/${id}`);

// ── Admin: Menu Config ───────────────────────────────────────────
export const fetchMenuConfigAdmin = () => api.get('/menu-config');
export const updateMenuConfig = (data: object) => api.put('/menu-config', data);

// ── Admin: Categories ────────────────────────────────────────────
export const fetchCategoriesAdmin = () => api.get('/categories/admin');
export const createCategory = (data: object) => api.post('/categories', data);
export const updateCategory = (id: string, data: object) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// ── Admin: Deals ─────────────────────────────────────────────────
export const fetchDealsAdmin = () => api.get('/deals/admin');
export const createDeal = (data: object) => api.post('/deals', data);
export const updateDeal = (id: string, data: object) => api.put(`/deals/${id}`, data);
export const deleteDeal = (id: string) => api.delete(`/deals/${id}`);

// ── Admin: Pizza CRUD ─────────────────────────────────────────────
export const createPizza = (data: object) => api.post('/pizzas', data);
export const updatePizza = (id: string, data: object) => api.put(`/pizzas/${id}`, data);
export const deletePizza = (id: string) => api.delete(`/pizzas/${id}`);

export default api;
