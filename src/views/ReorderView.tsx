import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Filter, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

function GeneratePOModal({ onClose }: { onClose: () => void }) {
  const { suppliers, products } = useStore();
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedProductSku, setSelectedProductSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableProducts = selectedSupplierId 
    ? products.filter(p => p.supplierId === selectedSupplierId)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    const product = products.find(p => p.sku === selectedProductSku);
    
    if (!supplier || !product || !quantity) return;

    const smsBody = `Purchase Order Request: Please supply ${quantity} units of ${product.name} (SKU: ${product.sku}). Please confirm availability and delivery date.`;
    
    // Using sms tag for mobile devices, or wa.me as a fallback
    const phoneClean = supplier.phone.replace(/[^0-9+]/g, '');
    const messageLink = `sms:${phoneClean}?body=${encodeURIComponent(smsBody)}`;
    
    // Automatically try to open the SMS app
    window.location.href = messageLink;

    setSuccessMessage(`Simulated sending SMS to ${supplier.phone}:\n"${smsBody}"`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Generate Purchase Order</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {successMessage ? (
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-emerald-800">Purchase Order Generated</h3>
                  <p className="text-sm text-emerald-700 mt-2 whitespace-pre-wrap">{successMessage}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    setSelectedProductSku(''); // Reset product when supplier changes
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Product</label>
                <select
                  value={selectedProductSku}
                  onChange={(e) => setSelectedProductSku(e.target.value)}
                  disabled={!selectedSupplierId || availableProducts.length === 0}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                  required
                >
                  <option value="">Select a product...</option>
                  {availableProducts.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name} (Cur. stock: {p.currentStock})</option>
                  ))}
                </select>
                {selectedSupplierId && availableProducts.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">This supplier has no assigned products.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            
            <div className="p-4 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedSupplierId || !selectedProductSku || !quantity} className="flex items-center gap-2">
                <Send size={16} /> Send Order Message
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ReorderView({ initialFilter = 'all' }: { initialFilter?: string }) {
  const { reorderAlerts, products, suppliers, markReordered } = useStore();
  const [filterType, setFilterType] = useState<string>(initialFilter);
  const [showPOModal, setShowPOModal] = useState(false);

  const filteredAlerts = reorderAlerts.filter(a => {
    if (filterType === 'all') return true;
    return a.urgencyLevel === filterType;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const urgencyWeight = { critical: 3, high: 2, medium: 1 };
    return urgencyWeight[b.urgencyLevel] - urgencyWeight[a.urgencyLevel];
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {showPOModal && <GeneratePOModal onClose={() => setShowPOModal(false)} />}
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Purchasing & Reorder</h2>
          </div>
        </div>
        <Button onClick={() => setShowPOModal(true)}>Generate Purchase Orders</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Urgency</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Product Detail</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Current Stock</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Supplier Info</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Rec. Order</th>
                <th className="px-6 py-3 text-right font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAlerts.map(alert => {
                const product = products.find(p => p.sku === alert.sku);
                const supplier = product ? suppliers.find(s => s.id === product.supplierId) : null;
                
                return (
                  <tr key={alert.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {alert.urgencyLevel === 'critical' ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                          Critical
                        </span>
                      ) : alert.urgencyLevel === 'high' ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                          High
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Medium
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{product?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{product?.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium leading-none">{alert.currentStock}</span>
                        <span className="text-xs text-gray-400 mt-1">Point target: {alert.reorderPoint}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{supplier?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Lead: {supplier?.leadTimeDays}d</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 text-sm py-1">
                        + {alert.recommendedOrderQty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => markReordered(alert.id)}>Create PO</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

