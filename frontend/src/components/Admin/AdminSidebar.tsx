import React from 'react';
import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';
import { SIDEBAR_ITEMS } from '../../data/adminPanelData';

interface AdminSidebarProps {
  pendingOrdersCount: number;
  onBackToStore: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  pendingOrdersCount,
  onBackToStore,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="w-full md:w-[260px] h-full bg-charcoal-black border-b md:border-b-0 md:border-r border-charcoal-border flex flex-col flex-shrink-0 z-20">
      {/* Sidebar Brand Logo */}
      <div className="flex-shrink-0 p-6 border-b border-charcoal-800 flex items-center justify-between">
          <div className="flex flex-col gap-1 items-start">
            <Logo />
          </div>
          {/* Simple exit toggle */}
          <button
            onClick={onBackToStore}
            className="text-xs bg-charcoal-800 text-cheese hover:bg-cheese hover:text-charcoal-black px-2 py-1 rounded font-medium uppercase transition-all tracking-wide md:hidden"
          >
            Exit
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`/admin/${item.path}`}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs tracking-wider relative cursor-pointer ${
                    isActive
                      ? 'bg-charcoal text-cheese border-l-4 border-cheese pl-3'
                      : 'text-cream/70 hover:text-white hover:bg-charcoal-dark'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cheese' : 'text-cream/50'}`} />
                    <span>{item.label}</span>
                    {item.id === 2 && pendingOrdersCount > 0 && (
                      <span className="absolute right-3 bg-burgundy border border-cheese/30 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono animate-pulse">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
          </nav>
        </div>

      {/* Sidebar Footer Account Profile */}
      <div className="flex-shrink-0 p-4 border-t border-charcoal-800 bg-charcoal-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border border-cheese object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-charcoal-black" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs !font-medium text-white block truncate uppercase font-display">Admin User</span>
            <span className="text-[9px] font-mono text-emerald-400 block truncate font-medium">SUPERUSER PORTAL</span>
          </div>
          <button
            onClick={onLogout}
            className="p-1 hover:bg-charcoal-800 rounded text-cream/50 hover:text-red-400 transition-colors cursor-pointer"
            title="Logout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onBackToStore}
          className="w-full mt-3 bg-charcoal-black hover:bg-burgundy hover:text-white text-xs border border-cheese/30 hover:border-red-500/20 text-cheese font-medium py-2 rounded-lg transition-all uppercase tracking-widest cursor-pointer"
        >
          ← Back to Storefront
        </button>
      </div>
    </aside>
  );
}
