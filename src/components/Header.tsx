import React, { useState } from 'react';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { EXPIRY_ALERTS, REORDER_ALERTS } from '../data/mockData';

interface HeaderProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userEmail?: string;
}

export function Header({ onNavigate, onLogout, userEmail }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userName = userEmail ? userEmail.split('@')[0] : 'John Doe';
  const displayUserName = userName === 'John Doe' ? userName : userName.charAt(0).toUpperCase() + userName.slice(1);
  const initials = displayUserName.substring(0, 2).toUpperCase();
  
  const activeAlerts = EXPIRY_ALERTS.filter(a => a.alertType === 'critical_3days').length + 
                       REORDER_ALERTS.filter(a => a.urgencyLevel === 'critical').length;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-8 print:hidden shadow-sm z-10 sticky top-0">
      <div className="flex w-full max-w-md items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search SKU, Product, or Batch..."
            className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 transition-all hover:bg-slate-100/50"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="text-right mr-2 hidden sm:block">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Location</p>
          <p className="text-sm font-bold text-slate-900 tracking-tight">Main Supermarket</p>
        </div>
        <div className="bg-slate-200 w-[1px] h-8 hidden sm:block"></div>
        <button 
          onClick={() => onNavigate('expiry:all')}
          className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {activeAlerts > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-center h-9 w-9 overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm uppercase"
          >
            {initials}
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-200/50 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-2 whitespace-nowrap">
                  <p className="text-sm font-bold text-slate-800">{displayUserName}</p>
                  <p className="text-xs text-slate-500">{userEmail || 'owner@supermarket.com'}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
