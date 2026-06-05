import { useState, useEffect } from 'react';
import {
  fetchOrders, fetchCustomers, fetchStaff, fetchCoupons, fetchAnalytics,
  updateOrderStage, createStaff, createCoupon,
  fetchHeroSlidesAdmin, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  fetchMenuConfigAdmin, updateMenuConfig,
  fetchCategoriesAdmin, createCategory, updateCategory, deleteCategory,
  fetchDealsAdmin, createDeal, updateDeal, deleteDeal,
  fetchPizzas, createPizza, updatePizza, deletePizza,
  fetchGallery
} from '../services/api';

export function useAdminData() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Analytics
  const [analytics, setAnalytics] = useState<any>({ revenue: 0, ordersHandled: 0, activeCouriers: 0, newSignups: 0 });

  // View 2 & 3: Orders
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // View 5: Customers
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  // View 6: Menu management
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: 'classic', desc: '', image: '' });

  // View 7: Coupons
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'Percentage', minOrder: '', expiry: '' });

  // View 9: Staff list
  const [staff, setStaff] = useState<any[]>([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Rider Dispatcher', status: 'On Duty' });

  const [elapsedTimers, setElapsedTimers] = useState<Record<string, number>>({});

  // Dynamic Content State
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [slideForm, setSlideForm] = useState({ id: '', title: '', subtitle: '', tagline: '', items: '', backgroundImg: '', ctaLabel: 'Order Now', isActive: true, order: 0, badgeTopLine: '', badgePriceLine: '', badgeBottomLine: '' });
  const [showSlideModal, setShowSlideModal] = useState(false);

  const [menuConfig, setMenuConfig] = useState<any>(null);
  const [menuConfigDraft, setMenuConfigDraft] = useState<any>(null);
  const [savingMenuConfig, setSavingMenuConfig] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryForm, setCategoryForm] = useState({ slug: '', name: '', iconName: 'Flame', order: 0 });
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [adminDeals, setAdminDeals] = useState<any[]>([]);
  const [dealForm, setDealForm] = useState({ title: '', discountBadge: '', description: '', originalPrice: '', dealPrice: '', endsInSeconds: '86400', isLimited: false, isActive: true });
  const [editingDeal, setEditingDeal] = useState<any | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);

  const [adminPizzas, setAdminPizzas] = useState<any[]>([]);
  const [pizzaForm, setPizzaForm] = useState({ name: '', tagline: '', description: '', price: '', category: 'spicy', isVeg: false, isSpicy: false, isPopular: false, image: '' });
  const [editingPizza, setEditingPizza] = useState<any | null>(null);
  const [showPizzaModal, setShowPizzaModal] = useState(false);

  const [gallery, setGallery] = useState<any[]>([]);

  // API data loading
  useEffect(() => {
    if (!authToken) return;
    
    fetchOrders().then(res => setOrders(res.data.map((o: any) => ({
      id: o._id,
      time: new Date(o.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      createdAt: o.createdAt,
      customer: o.customerName,
      items: o.items?.map((i: any) => `${i.quantity}x ${i.pizzaName}`).join(', ') || '',
      total: o.total,
      payment: o.paymentMethod || 'COD',
      status: o.stage?.charAt(0).toUpperCase() + o.stage?.slice(1) || 'Pending',
      rider: o.rider || 'Unassigned',
    })))).catch(() => { });

    fetchCustomers().then(res => setCustomers(res.data.map((c: any) => ({
      id: c._id,
      name: c.name,
      phone: c.phone,
      orders: c.ordersCount,
      spend: c.totalSpend,
      lastOrder: c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A',
      tier: c.tier,
      status: c.status,
    })))).catch(() => { });

    fetchStaff().then(res => setStaff(res.data.map((s: any) => ({
      id: s._id,
      name: s.name,
      role: s.role,
      status: s.status,
      ordersToday: s.ordersHandledToday,
      rating: s.rating,
    })))).catch(() => { });

    fetchCoupons().then(res => setCoupons(res.data.map((c: any) => ({
      code: c.code,
      discount: c.discountType === 'Percentage' ? `${c.discountValue}%` : `Rs.${c.discountValue} Flat`,
      type: c.discountType,
      minOrder: c.minOrderAmount,
      uses: c.uses,
      expiry: new Date(c.expiryDate).toLocaleDateString(),
      status: c.status,
    })))).catch(() => { });

    fetchHeroSlidesAdmin().then(res => setHeroSlides(res.data)).catch(() => {});
    fetchMenuConfigAdmin().then(res => { setMenuConfig(res.data); setMenuConfigDraft(res.data); }).catch(() => {});
    fetchCategoriesAdmin().then(res => setCategories(res.data)).catch(() => {});
    fetchDealsAdmin().then(res => setAdminDeals(res.data)).catch(() => {});
    fetchPizzas().then(res => setAdminPizzas(res.data)).catch(() => {});
    fetchAnalytics().then(res => setAnalytics(res.data)).catch(() => {});
    fetchGallery().then(res => setGallery(res.data)).catch(() => {});
  }, [authToken]);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setElapsedTimers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] += 1;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining} min`;
  };

  const handleAdvanceKanban = async (id: string) => {
    const stageMap: Record<string, string> = {
      'Pending': 'preparing',
      'Preparing': 'baking',
      'Baking': 'quality-check',
      'Quality-check': 'out-for-delivery',
      'Out-for-delivery': 'delivered',
    };
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const nextStage = stageMap[order.status] || order.status;
    try {
      await updateOrderStage(id, nextStage);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStage.charAt(0).toUpperCase() + nextStage.slice(1) } : o));
    } catch { }
  };

  const handleCancelKanban = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: 'Cancelled' };
      }
      return o;
    }));
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(prev => prev.filter(o => o !== id));
    } else {
      setSelectedOrders(prev => [...prev, id]);
    }
  };

  const handleGenerateCouponCode = () => {
    const randomCode = 'PZ_XP_' + Math.floor(100 + Math.random() * 900);
    setNewCoupon(prev => ({ ...prev, code: randomCode }));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthToken(null);
  };

  return {
    state: {
      authToken, activeTab, searchQuery, notifications, orderFilter, orders, selectedOrders,
      customers, selectedCustomer, menuItems, showAddMenuModal, newMenuItem, coupons, newCoupon,
      staff, showAddStaffModal, newStaff, elapsedTimers, heroSlides, editingSlide, slideForm,
      showSlideModal, menuConfig, menuConfigDraft, savingMenuConfig, categories, categoryForm,
      editingCategory, showCategoryModal, adminDeals, dealForm, editingDeal, showDealModal,
      adminPizzas, pizzaForm, editingPizza, showPizzaModal, analytics, gallery
    },
    actions: {
      setAuthToken, setActiveTab, setSearchQuery, setNotifications, setOrderFilter, setOrders,
      setSelectedOrders, setCustomers, setSelectedCustomer, setMenuItems, setShowAddMenuModal,
      setNewMenuItem, setCoupons, setNewCoupon, setStaff, setShowAddStaffModal, setNewStaff,
      setElapsedTimers, setHeroSlides, setEditingSlide, setSlideForm, setShowSlideModal,
      setMenuConfig, setMenuConfigDraft, setSavingMenuConfig, setCategories, setCategoryForm,
      setEditingCategory, setShowCategoryModal, setAdminDeals, setDealForm, setEditingDeal,
      setShowDealModal, setAdminPizzas, setPizzaForm, setEditingPizza, setShowPizzaModal,
      setAnalytics, setGallery,
      formatTimer, handleAdvanceKanban, handleCancelKanban, handleSelectAllOrders,
      handleToggleSelectOrder, handleGenerateCouponCode, handleMarkAllRead, handleLogout
    }
  };
}
