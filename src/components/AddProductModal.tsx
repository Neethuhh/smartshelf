import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Category, Product } from '../types';
import { useStore } from '../context/StoreContext';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Product) => void;
  initialProduct?: Product;
}

export function AddProductModal({ onClose, onAdd, initialProduct }: AddProductModalProps) {
  const { suppliers } = useStore();
  
  const [sku, setSku] = useState(initialProduct?.sku || `SKU_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState<Category>(initialProduct?.category || 'Fresh Produce');
  const [unitCost, setUnitCost] = useState(initialProduct ? initialProduct.unitCost.toString() : '');
  const [sellingPrice, setSellingPrice] = useState(initialProduct ? initialProduct.sellingPrice.toString() : '');
  const [unit, setUnit] = useState(initialProduct?.unit || 'kg');
  const [isTimeSensitive, setIsTimeSensitive] = useState(initialProduct ? initialProduct.isTimeSensitive : true);
  const [shelfLifeDays, setShelfLifeDays] = useState(initialProduct ? initialProduct.shelfLifeDays.toString() : '7');
  const [minOrderQty, setMinOrderQty] = useState(initialProduct ? initialProduct.minOrderQty.toString() : '10');
  const [supplierId, setSupplierId] = useState(initialProduct?.supplierId || (suppliers.length > 0 ? suppliers[0].id : ''));

  const categories: Category[] = ['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Beverages', 'Packaged/FMCG'];
  const units = ['kg', 'L', 'unit', 'pack', 'bag', 'bunch'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unitCost || !sellingPrice || (isTimeSensitive && !shelfLifeDays)) return;

    onAdd({
      sku,
      name,
      category,
      unitCost: parseFloat(unitCost),
      sellingPrice: parseFloat(sellingPrice),
      unit,
      isTimeSensitive,
      shelfLifeDays: isTimeSensitive ? parseInt(shelfLifeDays, 10) : 0,
      minOrderQty: parseInt(minOrderQty, 10),
      supplierId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">{initialProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Organic Avocados"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                {suppliers.length === 0 && <option value="" disabled>No suppliers available</option>}
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Unit Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Selling Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Unit Type</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="time-sensitive"
                  checked={isTimeSensitive}
                  onChange={(e) => setIsTimeSensitive(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="time-sensitive" className="text-sm font-medium text-slate-700">
                  Is time-sensitive (perishable)?
                </label>
              </div>
            </div>

            {isTimeSensitive && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Shelf Life (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={shelfLifeDays}
                  onChange={(e) => setShelfLifeDays(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required={isTimeSensitive}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Minimum Order Qty</label>
              <input
                type="number"
                min="1"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(e.target.value)}
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
              className="px-4 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
            >
              {initialProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
