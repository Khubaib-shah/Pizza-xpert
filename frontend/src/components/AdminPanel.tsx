import { useState, useEffect } from 'react';
import {
  BarChart3,
  ShoppingBag,
  Clock,
  TrendingUp,
  Users,
  Layers,
  Ticket,
  Settings,
  Compass,
  Search,
  Bell,
  ChevronRight,
  Play,
  ChevronLeft,
  Check,
  AlertCircle,
  Truck,
  Plus,
  Filter,
  RotateCcw,
  Star,
  Flame,
  Coffee,
  HelpCircle,
  BookOpen,
  Share2,
  X,
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';
import Logo from './Logo';
import AdminLogin from './AdminLogin';
import { fetchOrders, fetchCustomers, fetchStaff, fetchCoupons, fetchAnalytics, updateOrderStage, createStaff, createCoupon } from '../services/api';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export default function AdminPanel({ onBackToStore }: AdminPanelProps) {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('admin_token'));

  // Navigation tabs (1 to 13)
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'Orders', message: 'New order #XP-7801 placed by Rajesh Kumar', time: '2 mins ago', read: false },
    { id: '2', type: 'System', message: 'Main Deck Oven 2 reaches target 850°F', time: '5 mins ago', read: false },
    { id: '3', type: 'Orders', message: 'Rider Vicky marked Order #XP-7798 as DELIVERED', time: '12 mins ago', read: true },
    { id: '4', type: 'Promotions', message: 'Coupon code WOODFIRE30 activated by 45 accounts', time: '1 hr ago', read: true },
  ]);

  // View 2: Orders state
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orders, setOrders] = useState([
    { id: 'XP-7801', time: '20:14', customer: 'Rajesh Kumar', items: '1x Loaded Monster Cheese, 1x Coca-Cola', total: 1140, payment: 'UPI Paid', status: 'Pending', rider: 'Unassigned' },
    { id: 'XP-7800', time: '20:05', customer: 'Amina Begum', items: '2x Spicy Garlic Zing, 1x Breadsticks', total: 890, payment: 'COD', status: 'Preparing', rider: 'Rider Vicky' },
    { id: 'XP-7799', time: '19:50', customer: 'Chris Fernandes', items: '1x Woodfire Marinara Jumbos', total: 690, payment: 'Card Paid', status: 'Ready', rider: 'Rider Vicky' },
    { id: 'XP-7798', time: '19:33', customer: 'Devendra Patel', items: '3x Classic Margherita Personal', total: 1240, payment: 'UPI Paid', status: 'Delivered', rider: 'Rider Vicky' },
    { id: 'XP-7797', time: '19:10', customer: 'Sania Mirza', items: '1x Double Herb Overload', total: 540, payment: 'UPI Paid', status: 'Cancelled', rider: 'None' },
    { id: 'XP-7796', time: '18:45', customer: 'Kabir Thapar', items: '1x BBQ Pulled Paneer, 1x Garlic Knots', total: 720, payment: 'Card Paid', status: 'Delivered', rider: 'Rider Rahul' },
  ]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // View 5: Customers state
  const [customers, setCustomers] = useState([
    { id: 'C-9901', name: 'Rajesh Kumar', phone: '+91 98765 43210', orders: 42, spend: 38450, lastOrder: '2026-06-01', tier: 'VIP', status: 'Active' },
    { id: 'C-9902', name: 'Amina Begum', phone: '+91 99123 45678', orders: 19, spend: 18200, lastOrder: '2026-06-01', tier: 'Returning', status: 'Active' },
    { id: 'C-9903', name: 'Chris Fernandes', phone: '+91 98222 33344', orders: 8, spend: 7500, lastOrder: '2026-05-31', tier: 'Standard', status: 'Active' },
    { id: 'C-9904', name: 'Devendra Patel', phone: '+91 97654 32109', orders: 56, spend: 58240, lastOrder: '2026-06-01', tier: 'VIP', status: 'Active' },
    { id: 'C-9905', name: 'Sania Mirza', phone: '+91 91234 56789', orders: 3, spend: 2100, lastOrder: '2026-05-28', tier: 'New', status: 'Active' },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  // View 6: Menu management
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'The Ultimate Pepperoni Explosion', category: 'loaded', price: 699, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', active: true, desc: 'Smothered with double artisanal pepperoni and dripping house-aged mozzarella' },
    { id: '2', name: 'Woodfire Marinara Jumbo', category: 'classic', price: 499, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', active: true, desc: 'San Marzano dynamic marinara, fresh basil leaves, extra cheese, and virgin olive spray' },
    { id: '3', name: 'Spicy Garlic Zing', category: 'spicy', price: 549, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80', active: true, desc: 'Bird-eye chili flakes, roasted pungent garlic crowns, bullet capsicums and cheese' },
    { id: '4', name: 'Double Herb Overload', category: 'cheesy', price: 599, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80', active: true, desc: 'Aged white cheddar, local asiago, dynamic goat cheese sprinkles and rosemary bouquet' },
  ]);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: 'classic', desc: '', image: '' });

  // View 7: Coupons
  const [coupons, setCoupons] = useState([
    { code: 'XPERT50', discount: '50%', type: 'Percentage', minOrder: 500, uses: 142, expiry: '2026-06-15', status: 'Active' },
    { code: 'CHEEZY30', discount: '₹120 Flat', type: 'Flat', minOrder: 400, uses: 95, expiry: '2026-06-10', status: 'Active' },
    { code: 'SUNDAYSAAS', discount: '20%', type: 'Percentage', minOrder: 600, uses: 310, expiry: '2026-06-30', status: 'Active' },
  ]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'Percentage', minOrder: '', expiry: '' });

  // View 9: Staff list
  const [staff, setStaff] = useState([
    { id: 'ST-01', name: 'Rider Vicky', role: 'Rider Dispatcher', status: 'On Duty', ordersToday: 14, rating: 4.9 },
    { id: 'ST-02', name: 'Rider Rahul', role: 'Rider Dispatcher', status: 'On Duty', ordersToday: 11, rating: 4.8 },
    { id: 'ST-03', name: 'Chef Sanjeev', role: 'Head Pizza Artisan', status: 'On Duty', ordersToday: 32, rating: 5.0 },
    { id: 'ST-04', name: 'Chef Amrita', role: 'Oven Master', status: 'Off Duty', ordersToday: 18, rating: 4.7 },
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Rider Dispatcher', status: 'On Duty' });

  // Timers and auto-refresh simulated state
  const [elapsedTimers, setElapsedTimers] = useState<Record<string, number>>({});

  // API data loading
  useEffect(() => {
    if (!authToken) return;
    // Load all admin data in parallel
    fetchOrders().then(res => setOrders(res.data.map((o: any) => ({
      id: o._id,
      time: new Date(o.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
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
      discount: c.discountType === 'Percentage' ? `${c.discountValue}%` : `₨${c.discountValue} Flat`,
      type: c.discountType,
      minOrder: c.minOrderAmount,
      uses: c.uses,
      expiry: new Date(c.expiryDate).toLocaleDateString(),
      status: c.status,
    })))).catch(() => { });
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

  // Helper actions for Kanban orders - updates backend via API
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

  // Bulk actions Orders
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

  // Create coupon generator helper
  const handleGenerateCouponCode = () => {
    const randomCode = 'SAAS' + Math.floor(100 + Math.random() * 900);
    setNewCoupon(prev => ({ ...prev, code: randomCode }));
  };

  // Notifications helper
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthToken(null);
  };

  if (!authToken) {
    return (
      <AdminLogin
        onLoginSuccess={(token) => {
          localStorage.setItem('admin_token', token);
          setAuthToken(token);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-gray text-cream font-sans antialiased flex flex-col md:flex-row relative">

      {/* ━━ LAYOUT: LEFT SIDEBAR FIXED ━━ */}
      <aside className="w-full md:w-[260px] bg-charcoal-black border-b md:border-b-0 md:border-r border-charcoal-border flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          {/* Sidebar Brand Logo */}
          <div className="p-6 border-b border-charcoal-800 flex items-center justify-between">
            <div className="flex flex-col gap-1 items-start">
              <Logo />
              <span className="text-[9px] tracking-wide font-mono text-cheese font-bold uppercase mt-1 pl-1">SAAS BACKPLANE</span>
            </div>
            {/* Simple exit toggle */}
            <button
              onClick={onBackToStore}
              className="text-xs bg-charcoal-800 text-cheese hover:bg-cheese hover:text-charcoal-black px-2 py-1 rounded font-bold uppercase transition-all tracking-wide md:hidden"
            >
              Exit
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 1, label: 'Analytics Deck', icon: BarChart3 },
              { id: 2, label: 'Order Registry', icon: ShoppingBag },
              { id: 3, label: 'Live Operations', icon: Clock },
              { id: 4, label: 'Delivery Radar', icon: Truck },
              { id: 5, label: 'Customers File', icon: Users },
              { id: 6, label: 'Menu Backstage', icon: Layers },
              { id: 7, label: 'Coupons Engine', icon: Ticket },
              { id: 8, label: 'Sales Deep-Dive', icon: TrendingUp },
              { id: 9, label: 'Staff Leaderboard', icon: Award },
              { id: 10, label: 'Kitchen Console', icon: Flame },
              { id: 11, label: 'Alert Gateway', icon: Bell },
              { id: 12, label: 'Widget Library', icon: Sparkles },
              { id: 13, label: 'System Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider relative cursor-pointer ${isActive
                    ? 'bg-charcoal text-cheese border-l-4 border-cheese pl-3'
                    : 'text-cream/70 hover:text-white hover:bg-charcoal-dark'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cheese' : 'text-cream/50'}`} />
                  <span>{item.label}</span>
                  {item.id === 3 && (
                    <span className="absolute right-3 bg-burgundy border border-cheese/30 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono animate-pulse">
                      {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account Profile */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-900">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border border-cheese object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-charcoal-black" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-black text-white block truncate uppercase font-display">Admin User</span>
              <span className="text-[9px] font-mono text-emerald-400 block truncate font-bold">SUPERUSER PORTAL</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-charcoal-800 rounded text-cream/50 hover:text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onBackToStore}
            className="w-full mt-3 bg-charcoal-black hover:bg-burgundy hover:text-white text-xs border border-cheese/30 hover:border-red-500/20 text-cheese font-black py-2 rounded-lg transition-all uppercase tracking-widest cursor-pointer"
          >
            ← Back to Storefront
          </button>
        </div>
      </aside>

      {/* ━━ LAYOUT: MAIN PANEL CONTENT ━━ */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-x-hidden">

        {/* TOP HEADER BAR */}
        <header className="h-16 bg-charcoal-black/90 backdrop-blur-md border-b border-charcoal-border px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-sm tracking-widest font-display font-black text-white uppercase flex items-center gap-2">
              <span>View:</span>
              <span className="text-cheese">
                {[
                  'Analytics Deck',
                  'Order Registry',
                  'Live Operations Kanban',
                  'Active Delivery Radar',
                  'Customers File',
                  'Menu backstage',
                  'Coupons Engine',
                  'Sales Deep-Dive Analytics',
                  'Staff & Courier Leaderboard',
                  'Kitchen Oven status',
                  'Realtime Alert gateway',
                  'Widget Library',
                  'System Settings'
                ][activeTab - 1]}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search header container */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Database Query..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-charcoal-gray border border-charcoal-border rounded-lg py-1.5 pl-9 pr-4 text-xs font-mono text-cream placeholder-cream/30 focus:outline-none focus:border-cheese w-48 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Notification triggers */}
            <button
              onClick={() => setActiveTab(11)}
              className="relative p-2 bg-charcoal border border-charcoal-800 hover:border-cheese/40 rounded-lg text-cheese transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-burgundy border border-cheese/40 w-4 h-4 rounded-full text-[8px] text-white flex items-center justify-center font-mono">
                {notifications.filter(n => !n.read).length}
              </span>
            </button>
          </div>
        </header>

        {/* MAIN BODY AND 13 INTERACTIVE VIEWS */}
        <div className="p-6 space-y-8 flex-1">

          {/* VIEW 1: ANALYTICS DASHBOARD */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Glassmorphism Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: "TODAY'S SAAS REVENUE", value: "₹28,450", change: "↑ 12% vs yesterday", glow: "shadow-[0_4px_20px_rgba(245,177,9,0.15)]", barGlow: "bg-cheese" },
                  { title: "TOTAL ORDERS HANDLED", value: "347", change: "↑ 8% count today", glow: "shadow-[0_4px_20px_rgba(34,197,94,0.15)]", barGlow: "bg-emerald-500" },
                  { title: "ACTIVE COURIER LOGGING", value: "23 Riders", change: "All GPS enabled", glow: "shadow-[0_4px_20px_rgba(59,130,246,0.15)]", barGlow: "bg-blue-500" },
                  { title: "NEW LOGGED VISITORS", value: "41 Signups", change: "↑ 18% loyalty signup", glow: "shadow-[0_4px_20px_rgba(239,68,68,0.15)]", barGlow: "bg-red-500" }
                ].map((card, idx) => (
                  <div key={idx} className={`bg-charcoal-border/70 backdrop-blur-md rounded-2xl p-4 border border-white/5 relative overflow-hidden flex flex-col justify-between h-28 hover:border-cheese/30 transition-all ${card.glow}`}>
                    <div className="absolute top-0 left-0 w-1 h-full col-scale" />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-cream/60 font-black">{card.title}</span>
                      <h3 className="text-3xl font-display font-black text-white mt-1">{card.value}</h3>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-cheese font-mono">{card.change}</span>
                      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full w-2/3 ${card.barGlow}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue line chart + Orders donut container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Custom revenue SVG line graph */}
                <div className="lg:col-span-8 bg-charcoal border border-charcoal-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs uppercase tracking-widest font-black text-white">REVENUE TIMELINE (LAST 30 DAYS)</h4>
                    <span className="text-xs text-cheese font-mono font-bold">AVG VALUE: ₹950/order</span>
                  </div>
                  {/* SVG graph */}
                  <div className="relative h-64 w-full">
                    <svg viewBox="0 0 500 200" className="w-full h-full text-cheese">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-cheese)" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="var(--color-cheese)" stopOpacity="0.0"></stop>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="var(--color-charcoal-muted)" strokeDasharray="3" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="var(--color-charcoal-muted)" strokeDasharray="3" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="var(--color-charcoal-muted)" strokeDasharray="3" />
                      {/* Area Fill */}
                      <path
                        d="M 0 160 Q 50 120 100 130 T 200 80 T 300 110 T 400 40 T 500 60 L 500 200 L 0 200 Z"
                        fill="url(#areaGrad)"
                      />
                      {/* Stroke Line */}
                      <path
                        d="M 0 160 Q 50 120 100 130 T 200 80 T 300 110 T 400 40 T 500 60"
                        fill="none"
                        stroke="var(--color-cheese)"
                        strokeWidth="3.5"
                      />
                      {/* Floating Indicator Circles */}
                      <circle cx="200" cy="80" r="5" fill="var(--color-charcoal-black)" stroke="var(--color-cheese)" strokeWidth="2" />
                      <circle cx="400" cy="40" r="5" fill="var(--color-charcoal-black)" stroke="var(--color-cheese)" strokeWidth="2" />
                    </svg>
                    <div className="absolute inset-0 flex justify-between items-end p-2 text-[9px] font-mono text-cream/40">
                      <span>May 01</span>
                      <span>May 10</span>
                      <span>May 20</span>
                      <span>May 31</span>
                    </div>
                  </div>
                </div>

                {/* Categories Donut Visualizer */}
                <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-black text-white mb-4">ORDERS BY CATEGORY</h4>
                    {/* Fake Donut SVG */}
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full circular-chart">
                          <path className="circle-bg"
                            stroke="var(--color-charcoal-muted)"
                            strokeWidth="4"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment Red */}
                          <path className="circle"
                            stroke="var(--color-burgundy)"
                            strokeWidth="4.5"
                            strokeDasharray="45, 100"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment Yellow */}
                          <path className="circle"
                            stroke="var(--color-cheese)"
                            strokeWidth="4.5"
                            strokeDasharray="30, 100"
                            strokeDashoffset="-45"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment Green */}
                          <path className="circle"
                            stroke="#10B981"
                            strokeWidth="4.5"
                            strokeDasharray="25, 100"
                            strokeDashoffset="-75"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col justify-center items-center">
                          <span className="text-xs font-mono font-black text-white">347</span>
                          <span className="text-[8px] text-cream/40 uppercase font-black">UTILITY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-cream/80">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-burgundy" /> Solid Loaded</span>
                      <span className="font-mono font-bold">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cheese" /> Woodfire Classics</span>
                      <span className="font-mono font-bold">30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Cheesy Herbals</span>
                      <span className="font-mono font-bold">25%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Peak hours heatmap grid (7-day x 24-hour grid simulation represented concisely for compactness) */}
              <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5">
                <h4 className="text-xs uppercase tracking-widest font-black text-white mb-3">PEAK ORDERING HEATMAP (7 DAYS × 24 HOURS GRID)</h4>
                <div className="space-y-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-8 text-[10px] font-mono text-cream/40">{day}</span>
                      <div className="flex-1 grid grid-cols-24 gap-0.5">
                        {Array.from({ length: 24 }).map((_, h) => {
                          // mock intensity
                          const isPeak = (h >= 12 && h <= 14) || (h >= 19 && h <= 21);
                          const opacity = isPeak ? 'bg-cheese' : 'bg-cheese/10';
                          return (
                            <div
                              key={h}
                              className={`h-3 rounded-sm ${opacity}`}
                              title={`${day} @ ${h}:00 - Intensity Grid`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-cream/30 mt-2">
                  <span>00:00 AM (MIDNIGHT)</span>
                  <span>12:00 PM (LUNCH RUSH)</span>
                  <span>08:00 PM (DINNER PEAK)</span>
                </div>
              </div>

              {/* Recent Orders table */}
              <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-charcoal-border flex justify-between items-center">
                  <h4 className="text-xs uppercase tracking-widest font-black text-white">RECENT ORDERS DESPATCH TRAIL</h4>
                  <button onClick={() => setActiveTab(2)} className="text-xs text-cheese font-black uppercase hover:underline">Full Registry →</button>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-charcoal-dark border-b border-charcoal-800 text-cream/40 uppercase font-bold text-[10px] tracking-wider">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items Pizza details</th>
                      <th className="p-3">Total Cost</th>
                      <th className="p-3">Workflow State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-800">
                    {orders.slice(0, 3).map(o => (
                      <tr key={o.id} className="hover:bg-charcoal-800/30 transition-colors font-mono">
                        <td className="p-3 font-bold text-cheese">{o.id}</td>
                        <td className="p-3 text-white font-sans font-bold">{o.customer}</td>
                        <td className="p-3 text-cream/70 font-sans">{o.items}</td>
                        <td className="p-3 text-white">₹{o.total}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${o.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            o.status === 'Preparing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              o.status === 'Ready' ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-green-500/10 text-green-500 border border-green-500/20'
                            }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: ORDERS MANAGEMENT */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${orderFilter === f
                        ? 'bg-cheese text-black'
                        : 'bg-charcoal-800 text-cream/80 hover:bg-[#2c2c2c]'
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Search orders */}
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Filter customer / code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-charcoal border border-charcoal-border rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white w-full focus:outline-none focus:border-cheese"
                  />
                  <Search className="w-4 h-4 text-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Bulk operations dashboard */}
              {selectedOrders.length > 0 && (
                <div className="bg-burgundy/30 border border-cheese/30 rounded-xl p-3 flex items-center justify-between animate-fade-in text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cheese font-black">{selectedOrders.length} ORDERS SELECTED</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, status: 'Ready' } : o));
                        setSelectedOrders([]);
                      }}
                      className="bg-cheese text-black hover:bg-yellow-400 font-extrabold px-3 py-1 rounded"
                    >
                      Mark as Ready
                    </button>
                    <button
                      onClick={() => {
                        setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, rider: 'Rider Vicky' } : o));
                        setSelectedOrders([]);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1 rounded"
                    >
                      Assign Rider Vicky
                    </button>
                    <button
                      onClick={() => {
                        alert(`Generating labels container for: ${selectedOrders.join(', ')}`);
                      }}
                      className="bg-zinc-700 hover:bg-zinc-600 font-extrabold px-3 py-1 rounded"
                    >
                      Print Slips
                    </button>
                  </div>
                </div>
              )}

              {/* Big central list */}
              <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-charcoal-black border-b border-charcoal-800 text-cream/40 uppercase font-bold text-[10px] tracking-wider select-none">
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length}
                          onChange={handleSelectAllOrders}
                          className="rounded text-cheese"
                        />
                      </th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Stamp</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Courier assigned</th>
                      <th className="p-4">Docket Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Trigger workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-800">
                    {orders
                      .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
                      .filter(o => o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(o => {
                        const isChecked = selectedOrders.includes(o.id);
                        return (
                          <tr key={o.id} className={`hover:bg-charcoal-800/20 transition-all font-mono ${isChecked ? 'bg-yellow-500/5' : ''}`}>
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectOrder(o.id)}
                                className="rounded text-cheese"
                              />
                            </td>
                            <td className="p-4 font-black text-cheese">{o.id}</td>
                            <td className="p-4 text-cream/50">{o.time}</td>
                            <td className="p-4 font-sans font-medium text-white">{o.customer}</td>
                            <td className="p-4 font-sans text-cream/70 truncate max-w-xs">{o.items}</td>
                            <td className="p-4 font-sans text-xs">{o.payment}</td>
                            <td className="p-4 font-sans font-bold text-cheese/80">{o.rider}</td>
                            <td className="p-4 text-white font-bold">₹{o.total}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${o.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                o.status === 'Preparing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  o.status === 'Ready' ? 'bg-yellow-400/15 text-yellow-500 border border-yellow-500/20' :
                                    o.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                      'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleAdvanceKanban(o.id)}
                                  className="bg-charcoal-800 hover:bg-cheese hover:text-black border border-white/5 transition-all rounded py-1 px-2.5 text-[10px] uppercase font-mono font-black text-cheese"
                                >
                                  Advance Step →
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: LIVE ORDERS KANBAN */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {/* Kanban description row with live pulsating dot */}
              <div className="flex items-center justify-between bg-charcoal p-4 border border-charcoal-border rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-mono text-white">LIVE SAAS TRANSACTION STREAM ACTIVATED</span>
                </div>
                <div className="text-[10px] text-cream/40 font-mono text-right">AUTOMATIC RETRIES: ENABLED | TICK INTERVAL: 1000ms</div>
              </div>

              {/* Columns container */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'New Orders', status: 'Pending', countColor: 'bg-amber-500' },
                  { title: 'Preparing', status: 'Preparing', countColor: 'bg-blue-500' },
                  { title: 'Ready for Dispatch', status: 'Ready', countColor: 'bg-yellow-500' },
                  { title: 'Out for Delivery', status: 'Delivered', countColor: 'bg-emerald-500' },
                ].map(col => {
                  const items = orders.filter(o => o.status === col.status);
                  return (
                    <div key={col.status} className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 flex flex-col space-y-3 min-h-[460px]">
                      {/* Column Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-charcoal-border">
                        <span className="text-xs uppercase tracking-widest font-black text-white">{col.title}</span>
                        <span className={`text-[10px] text-black ${col.countColor} font-mono font-black rounded-full px-2 py-0.5`}>
                          {items.length}
                        </span>
                      </div>

                      {/* Stack of Cards */}
                      <div className="space-y-3 overflow-y-auto flex-1">
                        {items.length === 0 ? (
                          <div className="text-center py-10 text-xs text-cream/20 font-mono">No active jobs in queue.</div>
                        ) : (
                          items.map(card => {
                            const secs = elapsedTimers[card.id] || 0;
                            const isDelayed = secs > 600; // RED state if legacy exceeds 10 mins
                            return (
                              <div key={card.id} className="bg-charcoal border border-white/5 rounded-xl p-3 hover:border-cheese/30 transition-all shadow-lg space-y-2 relative">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-black text-cheese font-mono">{card.id}</span>
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isDelayed ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-emerald-400'
                                    }`}>
                                    ⌛ {formatTimer(secs)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-white block">{card.customer}</span>
                                  <span className="text-[11px] text-cream/60 block mt-0.5">{card.items}</span>
                                </div>
                                <div className="pt-2 border-t border-charcoal-border flex justify-between items-center text-[10px]">
                                  <button
                                    onClick={() => handleCancelKanban(card.id)}
                                    className="text-red-400 hover:text-red-300 font-bold uppercase"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAdvanceKanban(card.id)}
                                    className="bg-charcoal-border hover:bg-cheese hover:text-black hover:border-transparent text-cheese text-[9px] uppercase font-black px-2 py-1 rounded transition-all"
                                  >
                                    Advance →
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: DELIVERY RADAR */}
          {activeTab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 space-y-0">
              {/* Left Courier List */}
              <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-4 overflow-y-auto h-[480px] space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-black text-white pb-2 border-b border-charcoal-border">ACTIVE DISPATCH RIDERS</h4>
                {[
                  { name: 'Rider Vicky', activeJob: 'XP-7800', eta: '4 mins', phone: '+91 99012 34567', pulse: 'bg-emerald-500' },
                  { name: 'Rider Rahul', activeJob: 'XP-7796', eta: '9 mins', phone: '+91 91234 56711', pulse: 'bg-emerald-500' },
                  { name: 'Rider Amit', activeJob: 'Resting', eta: '--', phone: '+91 98765 43210', pulse: 'bg-amber-500' },
                ].map((rider, idx) => (
                  <div key={idx} className="bg-charcoal-black p-3 border border-white/5 rounded-xl hover:border-cheese/30 transition-all select-none flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-white block">{rider.name}</span>
                      <span className="text-[10px] text-cream/50 block mt-0.5">{rider.phone}</span>
                      <span className="text-[9px] text-cheese font-mono block mt-1">LATEST ASSIGNED: {rider.activeJob}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-white">{rider.eta}</span>
                      <div className="flex items-center gap-1.5 justify-end mt-1">
                        <span className={`w-2 h-2 rounded-full ${rider.pulse} animate-pulse`} />
                        <span className="text-[9px] uppercase font-mono text-cream/40">ONLINE</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Radar Area HUD screen */}
              <div className="lg:col-span-8 bg-charcoal-black border border-charcoal-border rounded-2xl p-5 flex flex-col justify-between h-[480px] relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-radar opacity-15 pointer-events-none" />
                <div className="z-10 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-cheese">GPS BACKPLANE RADAR SCREEN (MOCK DESIGN)</span>
                  <span className="text-[10px] bg-burgundy px-2 py-0.5 border border-cheese/20 font-mono rounded text-white font-extrabold uppercase select-none">GRID LOCK: LIVE</span>
                </div>

                {/* Simulated Radar Map Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cheese/10 rounded-full flex items-center justify-center">
                  <div className="w-56 h-56 border border-cheese/15 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 border border-cheese/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-cheese rounded-full animate-ping" />
                    </div>
                  </div>

                  {/* Pizza Express Marker Pins */}
                  <div className="absolute right-12 top-24 z-10 animate-float-levitate">
                    <div className="relative group cursor-pointer">
                      <div className="bg-burgundy text-cheese border border-cheese font-black text-[10px] px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                        <Truck className="w-3 h-3 text-cheese" fill="currentColor" />
                        <span>Vicky</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-cheese rounded-full mx-auto mt-0.5 border border-charcoal-black" />
                    </div>
                  </div>

                  <div className="absolute left-16 bottom-20 z-10 animate-pulse">
                    <div className="relative group cursor-pointer">
                      <div className="bg-zinc-800 text-white border border-white/20 font-black text-[10px] px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                        <Truck className="w-3 h-3 text-cheese" />
                        <span>Rahul</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mx-auto mt-0.5 border border-charcoal-black" />
                    </div>
                  </div>
                </div>

                <div className="z-10 flex justify-between items-center text-[10px] font-mono text-cream/40 select-none">
                  <span>ANTENNA: DUPLEX_WAVE_990HZ</span>
                  <span>RIDER ASSISTANCE RADIUS: 5.0 KM LOCK</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: CUSTOMERS DIRECTORY */}
          {activeTab === 5 && (
            <div className="space-y-6 relative">
              {/* Search + filter bar */}
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search name, phone or tier..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-charcoal border border-charcoal-border rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white w-full focus:outline-none focus:border-cheese"
                  />
                  <Search className="w-4 h-4 text-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="text-xs uppercase text-cheese font-mono">5 ACTIVE RECORDS LOADED</div>
              </div>

              {/* Table */}
              <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-charcoal-black border-b border-charcoal-800 text-cream/40 uppercase font-bold text-[10px] tracking-wider select-none">
                      <th className="p-4">Customer ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Registered Mobile</th>
                      <th className="p-4">Lifetime Orders</th>
                      <th className="p-4">Spend Index</th>
                      <th className="p-4">Loyalty Tier</th>
                      <th className="p-4">Last Activity</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-800">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tier.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(c => (
                        <tr key={c.id} className="hover:bg-charcoal-800/20 transition-all font-mono">
                          <td className="p-4 font-bold text-cream/50">{c.id}</td>
                          <td className="p-4 font-sans font-black text-white">{c.name}</td>
                          <td className="p-4 text-cream/70">{c.phone}</td>
                          <td className="p-4 text-center font-medium text-white">{c.orders}</td>
                          <td className="p-4 text-emerald-400 font-bold">₹{c.spend.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${c.tier === 'VIP' ? 'bg-yellow-500/10 text-cheese border border-cheese/30' :
                              c.tier === 'Returning' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-zinc-600/10 text-zinc-400'
                              }`}>
                              {c.tier}
                            </span>
                          </td>
                          <td className="p-4 text-cream/50">{c.lastOrder}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedCustomer(c)}
                              className="text-cheese hover:underline uppercase text-[10px] font-black"
                            >
                              Explore Dossier →
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* SLIDING REGISTER DETAIL DRAWER */}
              {selectedCustomer && (
                <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-charcoal-black/95 backdrop-blur-xl border-l border-charcoal-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 p-6 flex flex-col justify-between animate-slide-in">
                  <div>
                    {/* Header line */}
                    <div className="flex justify-between items-center pb-4 border-b border-charcoal-border">
                      <span className="text-[10px] uppercase font-mono text-cheese">Client Profile Explorer</span>
                      <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-white/5 rounded-full text-white hover:text-red-400 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Meta Detail Body */}
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-burgundy rounded-2xl flex items-center justify-center border-2 border-cheese font-display text-2xl font-black text-white">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white">{selectedCustomer.name}</h3>
                          <span className="text-xs text-cream/40 font-mono">{selectedCustomer.id} | Loyalty: {selectedCustomer.tier}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-charcoal p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] text-cream/40 uppercase font-mono block">Lifetime Billings</span>
                          <span className="text-lg font-mono font-medium text-white">₹{selectedCustomer.spend.toLocaleString()}</span>
                        </div>
                        <div className="bg-charcoal p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] text-cream/40 uppercase font-mono block">Aggregate orders</span>
                          <span className="text-lg font-mono font-bold text-cheese">{selectedCustomer.orders} Meals</span>
                        </div>
                      </div>

                      <div className="space-y-2 bg-charcoal p-4 rounded-xl border border-white/5 text-xs text-cream/80">
                        <strong className="text-white uppercase font-mono block text-[10px] pb-1 border-b border-charcoal-light">CRM PREFERENCES</strong>
                        <p><strong>Primary Address:</strong> sector 14, Penthouse Wing, Tech City, Gurgaon, India</p>
                        <p><strong>Topping Magnet:</strong> Sizzling Pepperoni, Roast Garlic Crown</p>
                        <p><strong>Drip Preference:</strong> Double extra cheese crusts always</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="w-full bg-burgundy text-cream font-extrabold uppercase py-3 rounded-xl border border-cheese/30 transition-all text-xs"
                  >
                    Close Dossier
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: MENU BACKSTAGE */}
          {activeTab === 6 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center items-start md:items-center">
                <span className="text-xs uppercase text-cream/50 tracking-w">Tweak your public recipes metadata</span>
                <button
                  onClick={() => setShowAddMenuModal(true)}
                  className="bg-cheese text-black hover:bg-yellow-400 font-black text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Custom Recipe
                </button>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden hover:border-cheese/30 transition-all flex flex-col justify-between">
                    <div className="relative h-44 w-full bg-charcoal-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-cheese">
                        {item.category.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white leading-tight">{item.name}</h4>
                        <p className="text-[11px] text-cream/50 mt-1.5 leading-tight">{item.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-charcoal-border flex justify-between items-center">
                        <span className="text-sm font-mono font-black text-cheese">₹{item.price}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] uppercase font-mono text-cream/40 font-bold">In Stock</label>
                          <input
                            type="checkbox"
                            checked={item.active}
                            onChange={() => {
                              setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, active: !m.active } : m));
                            }}
                            className="w-4 h-4 rounded text-cheese focus:ring-0 bg-charcoal-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD DIALOG MODAL */}
              {showAddMenuModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-charcoal-black border border-charcoal-border rounded-2xl max-w-md w-full p-6 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-charcoal-800">
                      <span className="text-sm font-display font-black text-white uppercase tracking-wider">CREATOR: BACKSTAGE PIZZA BUILDER</span>
                      <button onClick={() => setShowAddMenuModal(false)} className="text-cream/50 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-cream/40 uppercase font-mono">Pizza Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sizzling Goat Cheese Extreme"
                          value={newMenuItem.name}
                          onChange={e => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-cream/40 uppercase font-mono">Price (INR)</label>
                          <input
                            type="number"
                            placeholder="650"
                            value={newMenuItem.price}
                            onChange={e => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-cream/40 uppercase font-mono">Category</label>
                          <select
                            value={newMenuItem.category}
                            onChange={e => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
                          >
                            <option value="classic">Classic</option>
                            <option value="loaded">Loaded</option>
                            <option value="spicy">Spicy</option>
                            <option value="cheesy">Cheesy</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-cream/40 uppercase font-mono">Recipe Description</label>
                        <textarea
                          placeholder="Short tagline ingredients..."
                          rows={2}
                          value={newMenuItem.desc}
                          onChange={e => setNewMenuItem(prev => ({ ...prev, desc: e.target.value }))}
                          className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddMenuModal(false)}
                        className="bg-zinc-800 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (newMenuItem.name && newMenuItem.price) {
                            setMenuItems(prev => [...prev, {
                              id: String(prev.length + 1),
                              name: newMenuItem.name,
                              category: newMenuItem.category,
                              price: Number(newMenuItem.price),
                              desc: newMenuItem.desc || 'Rich custom oven craft',
                              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                              active: true
                            }]);
                            setShowAddMenuModal(false);
                            setNewMenuItem({ name: '', price: '', category: 'classic', desc: '', image: '' });
                          }
                        }}
                        className="bg-cheese text-black font-black text-xs uppercase px-4 py-2 rounded-xl"
                      >
                        Save Recipe
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 7: COUPONS */}
          {activeTab === 7 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 space-y-0">

              {/* Creator coupon form */}
              <div className="lg:col-span-5 bg-charcoal p-5 border border-charcoal-border rounded-2xl space-y-4 h-fit">
                <h4 className="text-xs uppercase tracking-widest font-black text-cheese pb-2 border-b border-charcoal-border">COUPON FACTORY SETTINGS</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-cream/40 uppercase font-mono">Campaign Code</label>
                      <input
                        type="text"
                        placeholder="e.g. WOODFIRE45"
                        value={newCoupon.code}
                        onChange={e => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                        className="w-full bg-charcoal-black border border-charcoal-light rounded-lg p-2.5 text-white text-xs font-mono"
                      />
                    </div>
                    <button
                      onClick={handleGenerateCouponCode}
                      className="self-end bg-charcoal-border text-cheese hover:bg-cheese hover:text-black font-mono font-black text-xs px-3 py-3 rounded-lg border border-cheese/30"
                    >
                      Autogen
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono">Discount String</label>
                      <input
                        type="text"
                        placeholder="e.g. 15% or ₹100 Flat"
                        value={newCoupon.discount}
                        onChange={e => setNewCoupon(prev => ({ ...prev, discount: e.target.value }))}
                        className="w-full bg-charcoal-black border border-charcoal-light rounded-lg p-2.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono">Coupon System</label>
                      <select
                        value={newCoupon.type}
                        onChange={e => setNewCoupon(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-charcoal-black border border-charcoal-light rounded-lg p-2.5 text-white"
                      >
                        <option value="Percentage">Percentage</option>
                        <option value="Flat">Flat Discount</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono">Min Ticket (INR)</label>
                      <input
                        type="number"
                        placeholder="499"
                        value={newCoupon.minOrder}
                        onChange={e => setNewCoupon(prev => ({ ...prev, minOrder: e.target.value }))}
                        className="w-full bg-charcoal-black border border-charcoal-light rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono">Expiry timeline</label>
                      <input
                        type="text"
                        placeholder="2026-06-30"
                        value={newCoupon.expiry}
                        onChange={e => setNewCoupon(prev => ({ ...prev, expiry: e.target.value }))}
                        className="w-full bg-charcoal-black border border-charcoal-light rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (newCoupon.code && newCoupon.discount) {
                        setCoupons(prev => [...prev, {
                          code: newCoupon.code,
                          discount: newCoupon.discount,
                          type: newCoupon.type,
                          minOrder: Number(newCoupon.minOrder) || 400,
                          uses: 0,
                          expiry: newCoupon.expiry || '2026-06-30',
                          status: 'Active'
                        }]);
                        setNewCoupon({ code: '', discount: '', type: 'Percentage', minOrder: '', expiry: '' });
                      }
                    }}
                    className="w-full bg-cheese text-black font-black uppercase text-xs tracking-wider py-3 rounded-xl transition-all"
                  >
                    Deploy Active Campaign Code
                  </button>
                </div>
              </div>

              {/* Coupons List Table */}
              <div className="lg:col-span-7 bg-charcoal p-4 border border-charcoal-border rounded-2xl overflow-x-auto text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-white">REVENUE PROMO CAMPAIGN REGISTRY</h4>
                  <span className="text-[10px] text-cream/40 font-mono">TRACKING: CTR PERFORMANCE</span>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-charcoal-black text-cream/40 border-b border-charcoal-border font-bold text-[10px] uppercase">
                      <th className="p-3">CODE</th>
                      <th className="p-3">VALUE</th>
                      <th className="p-3">MIN CART</th>
                      <th className="p-3">CTR REDEEMS</th>
                      <th className="p-3">EXP EXPIRY</th>
                      <th className="p-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-800 font-mono">
                    {coupons.map((c, idx) => (
                      <tr key={idx} className="hover:bg-charcoal-gray">
                        <td className="p-3 text-cheese font-black">{c.code}</td>
                        <td className="p-3 text-white">{c.discount}</td>
                        <td className="p-3">₹{c.minOrder}</td>
                        <td className="p-3 text-emerald-400 font-bold">{c.uses} Uses</td>
                        <td className="p-3 text-cream/50">{c.expiry}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW 8: SALES ANALYTICS */}
          {activeTab === 8 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-charcoal p-4 border border-charcoal-border rounded-xl flex-wrap gap-3">
                <span className="text-xs uppercase text-cheese font-mono">DASHBOARD TRADING HIGHLIGHTS IN INR</span>
                <div className="flex gap-2 text-xs uppercase font-extrabold font-mono">
                  {['Today', 'This Week', 'This Month', 'Custom Ranges'].map(p => (
                    <button key={p} className="p-2 bg-charcoal-black hover:bg-cheese hover:text-black rounded transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Custom area SVG Chart (yellow opacity gradient) */}
                <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5">
                  <h4 className="text-xs uppercase tracking-widest font-black text-white mb-4">REVENUE TRENDS OVER TIME</h4>
                  <div className="h-64">
                    <svg viewBox="0 0 500 200" className="w-full h-full text-cheese">
                      <defs>
                        <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-cheese)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--color-cheese)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 180 C 100 120, 150 160, 250 80 C 350 40, 400 90, 500 20 L 500 200 L 0 200 Z" fill="url(#yellowArea)" />
                      <path d="M0 180 C 100 120, 150 160, 250 80 C 350 40, 400 90, 500 20" fill="none" stroke="var(--color-cheese)" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                {/* Horizontal bar charts representing Top pizzas */}
                <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-black text-white">TOP SELLING RECIPES CHART</h4>
                  {[
                    { name: 'Loaded Pepperoni Explosion', pct: '85%', color: 'bg-cheese' },
                    { name: 'Woodfire Marinara Jumbos', pct: '64%', color: 'bg-emerald-500' },
                    { name: 'Spicy Garlic Zing Crust', pct: '48%', color: 'bg-blue-500' },
                    { name: 'Double Herb Overload', pct: '32%', color: 'bg-red-500' },
                  ].map((p, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-white font-bold">
                        <span>{p.name}</span>
                        <span className="font-mono text-cheese">{p.pct}</span>
                      </div>
                      <div className="w-full h-2 bg-charcoal-black rounded-full overflow-hidden">
                        <div className={`h-full ${p.color}`} style={{ width: p.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* VIEW 9: STAFF MANAGEMENT */}
          {activeTab === 9 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase text-cream/40 font-mono tracking-wider">AGGREGATE LEADERBOARD RATINGS FOR ON-DUTY STAFF</span>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-cheese text-black font-black uppercase text-xs px-4 py-2 rounded-xl"
                >
                  Register New Crew Member
                </button>
              </div>

              {/* Table list */}
              <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-charcoal-black text-cream/40 border-b border-charcoal-border font-bold text-[10px] uppercase">
                      <th className="p-4">Staff ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Business Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Orders Done Today</th>
                      <th className="p-4">Scorecard Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-800 font-mono">
                    {staff.map((member, idx) => (
                      <tr key={idx} className="hover:bg-charcoal-gray">
                        <td className="p-4 font-bold text-cream/50">{member.id}</td>
                        <td className="p-4 font-sans font-black text-white flex items-center gap-2">
                          {idx === 0 && <span className="text-cheese">🏆</span>}
                          <span>{member.name}</span>
                        </td>
                        <td className="p-4 font-sans text-cream/70">{member.role}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${member.status === 'On Duty' ? 'bg-green-500/10 text-emerald-400 border border-green-500/20' : 'bg-zinc-700/20 text-cream/40'
                            }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="p-4 text-center font-medium text-white">{member.ordersToday} Workings</td>
                        <td className="p-4 text-emerald-400 font-extrabold">⭐ {member.rating.toFixed(1)} / 5.0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add staff modal */}
              {showAddStaffModal && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-charcoal-black border border-charcoal-border rounded-2xl max-w-sm w-full p-6 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-charcoal-800">
                      <span className="text-xs font-black uppercase tracking-widest text-cheese">RECRUIT STAFF MEMBERS</span>
                      <button onClick={() => setShowAddStaffModal(false)} className="text-cream/40"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-cream/40 uppercase font-mono">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Deshmukh"
                          value={newStaff.name}
                          onChange={e => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-charcoal border border-[#2c2c2c] p-2.5 rounded text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-cream/40 uppercase font-mono">Job Title Role</label>
                        <select
                          value={newStaff.role}
                          onChange={e => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full bg-charcoal border border-[#2c2c2c] p-2.5 rounded text-white"
                        >
                          <option value="Rider Dispatcher">Rider Dispatcher</option>
                          <option value="Head Pizza Artisan">Head Pizza Artisan</option>
                          <option value="Oven Master">Oven Master</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end gap-2 text-xs">
                      <button onClick={() => setShowAddStaffModal(false)} className="bg-zinc-800 text-white px-3 py-1.5 rounded">Cancel</button>
                      <button
                        onClick={() => {
                          if (newStaff.name) {
                            setStaff(prev => [...prev, {
                              id: `ST-0${prev.length + 1}`,
                              name: newStaff.name,
                              role: newStaff.role,
                              status: 'On Duty',
                              ordersToday: 0,
                              rating: 5.0
                            }]);
                            setShowAddStaffModal(false);
                            setNewStaff({ name: '', role: 'Rider Dispatcher', status: 'On Duty' });
                          }
                        }}
                        className="bg-cheese text-black font-bold px-3 py-1.5 rounded"
                      >
                        Enlist Staff
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 10: KITCHEN STATUS */}
          {activeTab === 10 && (
            <div className="space-y-6">
              {/* KPIs Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-cream/40 font-mono uppercase">AVERAGE RECIPE PREPARATION TIME</span>
                    <h5 className="text-2xl font-bold font-display text-white mt-1">11.4 Minutes</h5>
                  </div>
                  <Clock className="w-8 h-8 text-cheese" />
                </div>
                <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-cream/40 font-mono uppercase">CONVEYOR QUEUE METADATA LOAD</span>
                    <h5 className="text-2xl font-bold font-display text-cheese mt-1">3 Active Jigs</h5>
                  </div>
                  <Layers className="w-8 h-8 text-cheese" />
                </div>
                <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-cream/40 font-mono uppercase">HEAT BACKPLANE OVERALL THERMAL</span>
                    <h5 className="text-2xl font-bold font-display text-emerald-400 mt-1">850°F (STABLE)</h5>
                  </div>
                  <Flame className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              {/* Station Control grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'STATION 1: DECK WOODFIRE OVEN 2', status: 'Active (green pulse)', pulseColor: 'bg-green-500', load: 'HIGH LOAD (27 Pizzas)', temp: '852°F' },
                  { name: 'STATION 2: CONVEYOR BARBECUE SLIDER 1', status: 'Idle (no queue)', pulseColor: 'bg-amber-400', load: 'NO QUEUE LOGGED', temp: '422°F' },
                  { name: 'STATION 3: GARNISH COLD VEGGIE DEPOT', status: 'Active (green pulse)', pulseColor: 'bg-green-500', load: '12 active tickets', temp: '38°F' },
                ].map((station, idx) => (
                  <div key={idx} className="bg-charcoal-black border border-charcoal-800 p-4 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-black text-cheese block truncate max-w-[180px]">{station.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${station.pulseColor} animate-pulse`} />
                        <span className="text-[9px] font-mono text-cream/30">ONLINE STATUS</span>
                      </div>
                    </div>

                    <div className="bg-charcoal p-3 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
                      <p className="text-white"><strong>Oven Temp Core:</strong> <span className="text-yellow-400 font-bold">{station.temp}</span></p>
                      <p className="text-cream/70"><strong>Payload Capacity:</strong> {station.load}</p>
                      <p className="text-cream/50"><strong>System status flags:</strong> OK_SYSTEM_NORMAL_FIBER</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 11: ALERT GATEWAY (NOTIFICATIONS) */}
          {activeTab === 11 && (
            <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-charcoal-border pb-3">
                <span className="text-xs uppercase tracking-widest font-extrabold text-cheese">SYSTEM CONTROL ALERTS CENTER</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="bg-charcoal-border hover:bg-cheese hover:text-black font-bold uppercase py-1 px-3 rounded text-xs transition-colors"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => setNotifications([])}
                    className="bg-burgundy hover:bg-red-600 font-bold uppercase py-1 px-3 rounded text-xs transition-colors"
                  >
                    Flush Feed
                  </button>
                </div>
              </div>

              {/* Stack */}
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 font-mono text-cream/20">All clear. No notifications logs.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-xl border flex items-center justify-between text-xs ${n.read ? 'bg-charcoal-dark border-charcoal-800 text-cream/50' : 'bg-burgundy/20 border-cheese/30 text-white'
                      }`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${n.type === 'Orders' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-400'
                          }`}>{n.type}</span>
                        <p className="font-sans font-bold">{n.message}</p>
                      </div>
                      <span className="text-[10px] font-mono text-cream/40">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW 12: WIDGET LIBRARY */}
          {activeTab === 12 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Single metric with sparkline & comparison */}
                <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(245,177,9,0.15)] space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cream/50 font-black">Variant A: COMPACT WITH PROGRESS BAR</span>
                    <h6 className="text-3xl font-display font-black text-white mt-1">₹42,890</h6>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-cheese" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-cream/40">
                      <span>STABLE COMPILIANCE AT 80%</span>
                      <span className="text-cheese">↑ 5%</span>
                    </div>
                  </div>
                </div>

                {/* Sparkling progress variant */}
                <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.15)] space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cream/50 font-black">Variant B: SPARKLING COMPARISON</span>
                    <h6 className="text-3xl font-display font-black text-white mt-1">4.96 Stars</h6>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-emerald-400">POS GLOW SHADOW INCLUDED</span>
                    <p className="text-[10px] text-cream/40">Highest courier evaluation performance today</p>
                  </div>
                </div>

                {/* Flat monochrome status */}
                <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(239,68,68,0.15)] space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cheese font-black">Variant C: ATTENTION GLOW CARDS</span>
                    <h6 className="text-3xl font-display font-black text-white mt-1">2 Oven Alerts</h6>
                  </div>
                  <div className="bg-charcoal-black/80 border border-red-500/20 px-2 py-1.5 rounded-lg text-[10px] font-mono text-red-400">
                    ⚠️ CONVEYOR HEAT BARRIER OVERRUN
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 13: SYSTEM SETTINGS */}
          {activeTab === 13 && (
            <div className="bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-6">
              <h4 className="text-xs uppercase tracking-widest font-black text-cheese pb-2 border-b border-charcoal-border">STORE ENGINE PROPERTIES</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-cream/40 uppercase font-mono block">Registered Storefront Title</label>
                    <input
                      type="text"
                      defaultValue="Pizza Xpert Woodfire Gourmet Gurgaon"
                      className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-cream/40 uppercase font-mono block">Support Email Coordinates</label>
                    <input
                      type="text"
                      defaultValue="support@pizzaxpert.saas"
                      className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-cream/40 uppercase font-mono block">Tax Register Code (GSTIN)</label>
                    <input
                      type="text"
                      defaultValue="06AAAAA0000A1Z5"
                      className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono block">Daily Open Timers</label>
                      <input
                        type="text"
                        defaultValue="11:00 AM"
                        className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-cream/40 uppercase font-mono block">Daily Close Timers</label>
                      <input
                        type="text"
                        defaultValue="03:00 AM"
                        className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-cheese uppercase font-mono block font-black">LOGISTICS LIMIT VALUES</label>
                    <div className="p-3 bg-zinc-800/20 border border-white/5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Base delivery radius locking limit</span>
                        <span className="font-medium text-white">5.0 Kilometers</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Surge price multiplier factor</span>
                        <span className="font-bold text-cheese">1.5x Multiplier</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-charcoal-border flex justify-end">
                <button
                  onClick={() => alert('Properties saved locally to local config database.')}
                  className="bg-cheese text-black font-black uppercase text-xs px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all cursor-pointer"
                >
                  Apply properties Override
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
