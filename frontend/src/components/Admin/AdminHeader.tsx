import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../data/adminPanelData';

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotificationsCount: number;
}

export default function AdminHeader({
  searchQuery,
  setSearchQuery,
  unreadNotificationsCount,
}: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Find current label based on URL path
  const currentPath = location.pathname.split('/').pop() || '';
  const currentItem = SIDEBAR_ITEMS.find(item => item.path === currentPath);
  const displayLabel = currentItem ? currentItem.label : 'Dashboard';

  return (
    <header className="h-16 bg-charcoal-black/90 backdrop-blur-md border-b border-charcoal-border px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-sm tracking-widest font-display font-medium text-white uppercase flex items-center gap-2">
          <span>View:</span>
          <span className="text-cheese">
            {displayLabel}
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
          onClick={() => navigate('/admin/alerts')}
          className="relative p-2 bg-charcoal border border-charcoal-800 hover:border-cheese/40 rounded-lg text-cheese transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-burgundy border border-cheese/40 w-4 h-4 rounded-full text-[8px] text-white flex items-center justify-center font-mono">
            {unreadNotificationsCount}
          </span>
        </button>
      </div>
    </header>
  );
}
