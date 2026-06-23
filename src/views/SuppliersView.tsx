import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Supplier, Product } from '../types';

export function SuppliersView() {
  const { suppliers, products, addSupplier, updateSupplier, deleteSupplier, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = (supplier: Supplier) => {
    if (editingSupplier) {
      updateSupplier(supplier);
    } else {
      addSupplier(supplier);
    }
    setShowAddModal(false);
  };

  const openAddModal = () => {
    setEditingSupplier(undefined);
    setShowAddModal(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowAddModal(true);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Suppliers Directory</h2>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddSupplierModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSupplier}
          initialSupplier={editingSupplier}
          products={products}
          updateProduct={updateProduct}
        />
      )}
      
      <Card className="flex-1 border-0 shadow-sm shadow-slate-200/50 bg-white/60 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          </div>
          <Button 
            onClick={openAddModal}
            className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
        
        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 sticky top-0 backdrop-blur-md border-b border-gray-100 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Supplier ID</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Supplier Name</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Lead Time (Days)</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Phone</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Products Supplied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white/40">
                {filteredSuppliers.map(supplier => {
                  const suppliedProducts = products.filter(p => p.supplierId === supplier.id);
                  
                  return (
                  <tr key={supplier.id} className="hover:bg-gray-50/50 group transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">{supplier.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.leadTimeDays}</td>
                    <td className="px-6 py-4 text-emerald-700 font-medium">{supplier.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                         <div className="flex flex-wrap gap-1 max-w-[250px]">
                           {suppliedProducts.length > 0 ? (
                             suppliedProducts.map(p => (
                               <span key={p.sku} className="inline-flex text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                 {p.name}
                               </span>
                             ))
                           ) : (
                             <span className="text-xs text-slate-400">No products assigned</span>
                           )}
                         </div>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                           <button 
                             onClick={() => openEditModal(supplier)}
                             className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                             title="Edit"
                           >
                             <Edit2 className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={() => {
                               if (window.confirm('Are you sure you want to delete this supplier?')) {
                                 deleteSupplier(supplier.id);
                               }
                             }}
                             className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                             title="Delete"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </div>
                      </div>
                    </td>
                  </tr>
                  )
                })}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddSupplierModal({ onClose, onAdd, initialSupplier, products, updateProduct }: { onClose: () => void, onAdd: (s: Supplier) => void, initialSupplier?: Supplier, products: Product[], updateProduct: (p: Product) => void }) {
  const [id, setId] = useState(initialSupplier?.id || `SUP_NEW_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
  const [name, setName] = useState(initialSupplier?.name || '');
  const [leadTimeDays, setLeadTimeDays] = useState(initialSupplier ? initialSupplier.leadTimeDays.toString() : '3');
  const [phone, setPhone] = useState(initialSupplier?.phone || '+1 ');
  
  const initialAssignedProducts = initialSupplier ? products.filter(p => p.supplierId === initialSupplier.id).map(p => p.sku) : [];
  const [selectedProductSKUs, setSelectedProductSKUs] = useState<string[]>(initialAssignedProducts);

  const toggleProductSelection = (sku: string) => {
    setSelectedProductSKUs(prev => 
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leadTimeDays || !phone) return;

    onAdd({
      id,
      name,
      leadTimeDays: parseInt(leadTimeDays, 10),
      phone,
    });

    // Update the supplier relationship for all products
    // (In a real app, this might need an API endpoint)
    products.forEach(p => {
      const isSelected = selectedProductSKUs.includes(p.sku);
      if (isSelected && p.supplierId !== id) {
        updateProduct({ ...p, supplierId: id });
      } else if (!isSelected && p.supplierId === id) {
        // Set to empty string or a 'default' supplier if unassigned
        updateProduct({ ...p, supplierId: '' });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">{initialSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Supplier Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Fresh Farms"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Lead Time (Days)</label>
              <input
                type="number"
                min="0"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-1234"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Supplied Products</label>
              <p className="text-xs text-slate-500 mb-2">Select the products this supplier provides:</p>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-md p-2 bg-slate-50">
                {products.length === 0 ? (
                  <p className="text-sm text-slate-500 p-2">No products available in inventory.</p>
                ) : (
                  <div className="space-y-1">
                    {products.map(p => (
                      <label key={p.sku} className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedProductSKUs.includes(p.sku)}
                          onChange={() => toggleProductSelection(p.sku)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">{p.name} <span className="text-slate-400 text-xs">({p.sku})</span></span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
            >
              {initialSupplier ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
