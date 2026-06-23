import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Category, Product } from '../types';
import { Search, Filter, ScanLine, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { AddProductModal } from '../components/AddProductModal';
import { useStore } from '../context/StoreContext';

export function InventoryView() {
  const { products, inventory, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [showScanner, setShowScanner] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const categories = ['All', 'Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Beverages', 'Packaged/FMCG'] as const;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleScan = (decodedText: string) => {
    setSearchTerm(decodedText);
    setShowScanner(false);
  };

  const handleAddProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
  };

  const openAddModal = () => {
    setEditingProduct(undefined);
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {showScanner && (
        <BarcodeScanner 
          onScan={handleScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}
      
      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
          initialProduct={editingProduct}
        />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Inventory Catalog</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={openAddModal}
            className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          <Button 
            variant="outline" 
            className="h-9 gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            onClick={() => setShowScanner(true)}
          >
            <ScanLine className="h-4 w-4" />
            Scan Barcode
          </Button>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 w-64 rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="h-9 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm outline-none focus:border-emerald-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">SKU</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Product Name</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Category</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Price</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Total Stock</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Total Cost</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Shelf Life</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => {
                  const totalStock = inventory.filter(i => i.sku === product.sku).reduce((sum, i) => sum + i.currentStock, 0);
                  const totalCost = product.unitCost * totalStock;
                  
                  return (
                    <tr key={product.sku} className="hover:bg-gray-50/50 group transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500">{product.sku}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        ₹{product.sellingPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{totalStock}</span> <span className="text-gray-500">{product.unit}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-700">
                        ₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            {product.isTimeSensitive ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                Time-Sensitive ({product.shelfLifeDays}d)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                                Stable
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this product?')) {
                                  deleteProduct(product.sku);
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
