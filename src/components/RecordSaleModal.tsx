import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function RecordSaleModal({ onClose }: { onClose: () => void }) {
  const { products, inventory, registerSale } = useStore();
  const [selectedSku, setSelectedSku] = useState('');
  const [quantity, setQuantity] = useState('1');

  // Filter out products that have no inventory
  const availableProducts = products.filter(p => {
    const stock = inventory.filter(i => i.sku === p.sku).reduce((sum, inv) => sum + inv.currentStock, 0);
    return stock > 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku || !quantity) return;
    
    registerSale(selectedSku, parseInt(quantity, 10));
    onClose();
  };

  const selectedProductStock = selectedSku ? inventory.filter(i => i.sku === selectedSku).reduce((sum, inv) => sum + inv.currentStock, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Record Sale</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                <option value="">Select a product...</option>
                {availableProducts.map(p => {
                  const stock = inventory.filter(i => i.sku === p.sku).reduce((sum, inv) => sum + inv.currentStock, 0);
                  return (
                    <option key={p.sku} value={p.sku}>{p.name} (Stock: {stock})</option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Quantity Sold</label>
              <input
                type="number"
                min="1"
                max={selectedProductStock || 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
              {selectedSku && (
                <p className="text-xs text-slate-500">Max available: {selectedProductStock}</p>
              )}
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
            <Button type="submit" disabled={!selectedSku || !quantity} className="flex items-center gap-2">
              <ShoppingCart size={16} /> Complete Sale
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
