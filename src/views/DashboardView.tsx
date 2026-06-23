import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, AlertTriangle, TrendingUp, AlertOctagon, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useStore } from '../context/StoreContext';
import { RecordSaleModal } from '../components/RecordSaleModal';

export function DashboardView({ onNavigate, userEmail }: { onNavigate?: (view: string) => void, userEmail?: string }) {
  const { products, inventory, expiryAlerts, reorderAlerts, pendingDeliveries, todaySales } = useStore();
  const [showSaleModal, setShowSaleModal] = useState(false);
  
  const totalValue = inventory.reduce((sum, inv) => {
    const p = products.find(p => p.sku === inv.sku);
    return sum + (p ? p.unitCost * inv.currentStock : 0);
  }, 0);

  const todaySalesRevenue = todaySales.reduce((sum, sale) => sum + sale.revenue, 0);

  const criticalExpiry = expiryAlerts.filter(a => a.alertType === 'critical_3days').length;
  const criticalReorder = reorderAlerts.filter(a => a.urgencyLevel === 'critical').length;

  return (
    <div className="flex flex-col h-full gap-6">
      {showSaleModal && <RecordSaleModal onClose={() => setShowSaleModal(false)} />}
      
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 overflow-hidden shadow-sm">
        {/* Decorative elements for the banner */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-900 opacity-30 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Good morning!</h1>
            <p className="text-emerald-100 font-medium mb-4">Here's your store overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</p>
            
            <div className="flex items-center gap-3 mb-4">
              <Button onClick={() => setShowSaleModal(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white border-none font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Record New Sale
              </Button>
            </div>

            {pendingDeliveries.length > 0 && (
              <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-500/30 backdrop-blur-md max-w-md">
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Package className="h-3 w-3" /> Scheduled Deliveries
                </p>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {pendingDeliveries.map(delivery => (
                    <div key={delivery.id} className="flex justify-between items-center text-sm">
                      <span className="text-white font-medium">{delivery.productName}</span>
                      <span className="text-emerald-200 bg-emerald-800/50 px-2 py-0.5 rounded text-xs">Qty: {delivery.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="mr-6">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Today's Sales</p>
              <p className="text-2xl font-bold text-white">₹{todaySalesRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Pending Deliveries</p>
              <p className="text-2xl font-bold text-white">{pendingDeliveries.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-4 bg-emerald-500 rounded-sm"></div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">Operating Metrics</h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 flex-grow pb-4">
        <Card 
          className="col-span-12 md:col-span-4 flex flex-col justify-center cursor-pointer transition-all hover:bg-slate-50 hover:shadow-md border border-slate-200/60"
          onClick={() => onNavigate && onNavigate('inventory')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Total Inventory Value</CardTitle>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter text-slate-900 drop-shadow-sm">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Main Supermarket</p>
          </CardContent>
        </Card>
        
        <Card 
          className="col-span-12 md:col-span-4 flex flex-col justify-center border-rose-100 cursor-pointer transition-all hover:bg-rose-50 hover:shadow-md hover:border-rose-200"
          onClick={() => onNavigate && onNavigate('expiry:critical_3days')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Critical Expiry</CardTitle>
            <div className="bg-rose-100 p-2 rounded-lg">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter text-rose-600 drop-shadow-sm">{criticalExpiry}</div>
            <p className="text-[10px] uppercase font-bold text-rose-400 mt-1">&lt;3 Days Remaining</p>
          </CardContent>
        </Card>

        <Card 
          className="col-span-12 md:col-span-4 flex flex-col justify-center border-amber-100 cursor-pointer transition-all hover:bg-amber-50 hover:shadow-md hover:border-amber-200"
          onClick={() => onNavigate && onNavigate('reorder:critical')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Stockouts / Low</CardTitle>
            <div className="bg-amber-100 p-2 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter text-amber-500 drop-shadow-sm">{criticalReorder}</div>
            <p className="text-[10px] uppercase font-bold text-amber-500/70 mt-1">Require immediate PO</p>
          </CardContent>
        </Card>

        <Card className="col-span-12 flex flex-col h-[400px] border border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Action Center</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              {expiryAlerts.filter(a => a.alertType === 'critical_3days').slice(0, 4).map(alert => (
                <div key={alert.id} className="p-3 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => onNavigate && onNavigate('reorder:all')}>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-bold text-rose-900">{products.find(p => p.sku === alert.sku)?.name}</p>
                    <p className="text-[10px] font-bold text-rose-600">CRITICAL</p>
                  </div>
                  <p className="text-[10px] text-rose-700">Exp: {alert.expiryDate} • Qty: {alert.currentQty}</p>
                </div>
              ))}
              {reorderAlerts.filter(a => a.urgencyLevel === 'critical').slice(0, 3).map(alert => (
                <div key={alert.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onNavigate && onNavigate('reorder:critical')}>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-bold text-slate-800">{products.find(p => p.sku === alert.sku)?.name}</p>
                    <p className="text-[10px] font-bold text-amber-600">REORDER</p>
                  </div>
                  <p className="text-[10px] text-slate-500">Remaining: {alert.currentStock}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
