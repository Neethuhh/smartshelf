/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { ExpiryAlertsView } from './views/ExpiryAlertsView';
import { ReorderView } from './views/ReorderView';
import { DailyReportView } from './views/DailyReportView';
import { LoginView } from './views/LoginView';
import { SuppliersView } from './views/SuppliersView';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { StoreProvider } from './context/StoreContext';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderView = () => {
    const [baseView, viewParam] = currentView.split(':');
    
    switch (baseView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} userEmail={userEmail} />;
      case 'inventory':
        return <InventoryView />;
      case 'expiry':
        return <ExpiryAlertsView initialFilter={viewParam || 'all'} />;
      case 'reorder':
        return <ReorderView initialFilter={viewParam || 'all'} />;
      case 'suppliers':
        return <SuppliersView />;
      case 'report':
        return <DailyReportView />;
      default:
        return <DashboardView onNavigate={setCurrentView} userEmail={userEmail} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <StoreProvider>
      <div 
        className="flex h-screen overflow-hidden font-sans text-slate-900 print:bg-white print:overflow-visible"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.85), rgba(249, 250, 251, 0.97)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Sidebar currentView={currentView} onChangeView={setCurrentView} onLogout={handleLogout} />
        <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible print:w-full">
          <Header onNavigate={setCurrentView} onLogout={handleLogout} userEmail={userEmail} />
          <main className="flex-1 overflow-y-auto p-6 print:p-0 print:overflow-visible w-full">
            <div className="mx-auto max-w-6xl min-h-full flex flex-col print:max-w-none print:w-full">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
