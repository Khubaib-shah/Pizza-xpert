import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminData } from './hooks/useAdminData';
import AdminLogin from '../../../modules/auth/components/AdminLogin';
import AdminSidebar from './Admin/AdminSidebar';
import AdminHeader from './Admin/AdminHeader';

// Import Views
import AnalyticsDashboard from './Admin/Views/AnalyticsDashboard';
import OrdersManagement from './Admin/Views/OrdersManagement';
import LiveOperations from './Admin/Views/LiveOperations';
import DeliveryRadar from './Admin/Views/DeliveryRadar';
import CustomersDirectory from './Admin/Views/CustomersDirectory';
import MenuBackstage from './Admin/Views/MenuBackstage';
import CouponsEngine from './Admin/Views/CouponsEngine';
import SalesAnalytics from './Admin/Views/SalesAnalytics';
import StaffManagement from './Admin/Views/StaffManagement';
import KitchenStatus from './Admin/Views/KitchenStatus';
import AlertGateway from './Admin/Views/AlertGateway';
import WidgetLibrary from './Admin/Views/WidgetLibrary';
import SystemSettings from './Admin/Views/SystemSettings';
import HeroCarouselManager from './Admin/Views/HeroCarouselManager';
import GalleryManager from './Admin/Views/GalleryManager';
import MenuConfigManager from './Admin/Views/MenuConfigManager';
import CategoriesManager from './Admin/Views/CategoriesManager';
import DealsManager from './Admin/Views/DealsManager';
import PizzaManager from './Admin/Views/PizzaManager';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export default function AdminPanel({ onBackToStore }: AdminPanelProps) {
  const { state, actions } = useAdminData();

  React.useEffect(() => {
    document.title = "Admin Dashboard | Pizza Xpert";
  }, []);

  if (!state.authToken) {
    return (
      <AdminLogin
        onLoginSuccess={(token) => {
          localStorage.setItem('admin_token', token);
          actions.setAuthToken(token);
        }}
        onBackToStore={onBackToStore}
      />
    );
  }

  const unreadNotifications = state.notifications.filter(n => !n.read).length;
  const pendingOrders = state.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="h-screen bg-charcoal-black font-sans flex flex-col md:flex-row relative overflow-hidden text-cream selection:bg-cheese selection:text-black">
      {/* Dynamic grain overlay background effect */}
      <div className="absolute inset-0 bg-grain mix-blend-overlay opacity-30 pointer-events-none" />

      {/* Left Sidebar Menu */}
      <AdminSidebar
        pendingOrdersCount={pendingOrders}
        onBackToStore={onBackToStore}
        onLogout={actions.handleLogout}
      />

      {/* Main Core Viewport */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden bg-charcoal-black/50 relative z-10">
        
        {/* Top Header Row */}
        <AdminHeader
          searchQuery={state.searchQuery}
          setSearchQuery={actions.setSearchQuery}
          unreadNotificationsCount={unreadNotifications}
        />

        {/* Dynamic Canvas Routing */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
          <Routes>
            <Route path="/" element={<Navigate to="orders" replace />} />
            <Route path="analytics" element={<AnalyticsDashboard orders={state.orders} analytics={state.analytics} />} />
            
            <Route path="orders" element={
              <OrdersManagement
                orders={state.orders}
                setOrders={actions.setOrders}
                orderFilter={state.orderFilter}
                setOrderFilter={actions.setOrderFilter}
                searchQuery={state.searchQuery}
                setSearchQuery={actions.setSearchQuery}
                selectedOrders={state.selectedOrders}
                setSelectedOrders={actions.setSelectedOrders}
                handleSelectAllOrders={actions.handleSelectAllOrders}
                handleToggleSelectOrder={actions.handleToggleSelectOrder}
                handleAdvanceKanban={actions.handleAdvanceKanban}
              />
            } />

            <Route path="live-orders" element={
              <LiveOperations
                orders={state.orders}
                elapsedTimers={state.elapsedTimers}
                formatTimer={actions.formatTimer}
                handleCancelKanban={actions.handleCancelKanban}
                handleAdvanceKanban={actions.handleAdvanceKanban}
              />
            } />

            <Route path="delivery-radar" element={<DeliveryRadar />} />

            <Route path="gallery" element={
              <GalleryManager 
                gallery={state.gallery || []} 
                setGallery={actions.setGallery} 
              />
            } />

            <Route path="customers" element={
              <CustomersDirectory
                customers={state.customers}
                searchQuery={state.searchQuery}
                setSearchQuery={actions.setSearchQuery}
                selectedCustomer={state.selectedCustomer}
                setSelectedCustomer={actions.setSelectedCustomer}
              />
            } />

            <Route path="menu" element={
              <MenuBackstage
                menuItems={state.menuItems}
                setMenuItems={actions.setMenuItems}
                showAddMenuModal={state.showAddMenuModal}
                setShowAddMenuModal={actions.setShowAddMenuModal}
                newMenuItem={state.newMenuItem}
                setNewMenuItem={actions.setNewMenuItem}
                gallery={state.gallery || []}
                categories={state.categories}
              />
            } />

            <Route path="coupons" element={
              <CouponsEngine
                coupons={state.coupons}
                setCoupons={actions.setCoupons}
                newCoupon={state.newCoupon}
                setNewCoupon={actions.setNewCoupon}
                handleGenerateCouponCode={actions.handleGenerateCouponCode}
              />
            } />

            <Route path="sales" element={<SalesAnalytics />} />

            <Route path="staff" element={
              <StaffManagement
                staff={state.staff}
                setStaff={actions.setStaff}
                showAddStaffModal={state.showAddStaffModal}
                setShowAddStaffModal={actions.setShowAddStaffModal}
                newStaff={state.newStaff}
                setNewStaff={actions.setNewStaff}
              />
            } />

            <Route path="kitchen" element={<KitchenStatus />} />

            <Route path="alerts" element={
              <AlertGateway
                notifications={state.notifications}
                setNotifications={actions.setNotifications}
                handleMarkAllRead={actions.handleMarkAllRead}
              />
            } />

            <Route path="widgets" element={<WidgetLibrary />} />
            
            <Route path="settings" element={<SystemSettings />} />

            <Route path="hero-slides" element={
              <HeroCarouselManager
                heroSlides={state.heroSlides}
                setHeroSlides={actions.setHeroSlides}
                editingSlide={state.editingSlide}
                setEditingSlide={actions.setEditingSlide}
                slideForm={state.slideForm}
                setSlideForm={actions.setSlideForm}
                showSlideModal={state.showSlideModal}
                setShowSlideModal={actions.setShowSlideModal}
                gallery={state.gallery}
                onUploadSuccess={(img: any) => actions.setGallery((prev: any) => [img, ...prev])}
              />
            } />

            <Route path="toppings" element={
              <MenuConfigManager
                menuConfigDraft={state.menuConfigDraft}
                setMenuConfigDraft={actions.setMenuConfigDraft}
                setMenuConfig={actions.setMenuConfig}
                savingMenuConfig={state.savingMenuConfig}
                setSavingMenuConfig={actions.setSavingMenuConfig}
              />
            } />

            <Route path="categories" element={
              <CategoriesManager
                categories={state.categories}
                setCategories={actions.setCategories}
                editingCategory={state.editingCategory}
                setEditingCategory={actions.setEditingCategory}
                categoryForm={state.categoryForm}
                setCategoryForm={actions.setCategoryForm}
                showCategoryModal={state.showCategoryModal}
                setShowCategoryModal={actions.setShowCategoryModal}
              />
            } />

            <Route path="deals" element={
              <DealsManager
                adminDeals={state.adminDeals}
                setAdminDeals={actions.setAdminDeals}
                dealForm={state.dealForm}
                setDealForm={actions.setDealForm}
                editingDeal={state.editingDeal}
                setEditingDeal={actions.setEditingDeal}
                showDealModal={state.showDealModal}
                setShowDealModal={actions.setShowDealModal}
                gallery={state.gallery || []}
                onUploadSuccess={(img: any) => actions.setGallery((prev: any) => [img, ...prev])}
              />
            } />

            <Route path="pizzas" element={
              <PizzaManager
                adminPizzas={state.adminPizzas}
                setAdminPizzas={actions.setAdminPizzas}
                pizzaForm={state.pizzaForm}
                setPizzaForm={actions.setPizzaForm}
                editingPizza={state.editingPizza}
                setEditingPizza={actions.setEditingPizza}
                showPizzaModal={state.showPizzaModal}
                setShowPizzaModal={actions.setShowPizzaModal}
                categories={state.categories}
                gallery={state.gallery || []}
                onUploadSuccess={(img: any) => actions.setGallery((prev: any) => [img, ...prev])}
              />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}
