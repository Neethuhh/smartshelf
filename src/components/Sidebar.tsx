import React from 'react';
import { LayoutDashboard, Package, AlertTriangle, TrendingUp, ShoppingCart, FileText, LogOut, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import logoUrl from '../assets/images/smartshelf_logo_1782233833498.jpg';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onChangeView, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle },
    { id: 'reorder', label: 'Purchasing', icon: ShoppingCart },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'report', label: 'Daily Report', icon: FileText },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 print:hidden">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="SmartShelf Logo" 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.5)] object-cover" 
          />
          <span className="text-xl font-bold tracking-tight text-white uppercase flex items-center">
            Smart<span className="text-emerald-500">Shelf</span>
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView.split(':')[0] === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-200",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-slate-500")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 px-3 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Store Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Online & Syncing</span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
        >
          <LogOut className="h-4 w-4 opacity-70" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
