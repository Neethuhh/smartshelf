import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, InventoryItem, ExpiryAlert, ReorderAlert, ForecastData, ProductSale, PendingDelivery, Supplier } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface StoreContextType {
  products: Product[];
  inventory: InventoryItem[];
  expiryAlerts: ExpiryAlert[];
  reorderAlerts: ReorderAlert[];
  forecastData: ForecastData[];
  todaySales: ProductSale[];
  pendingDeliveries: PendingDelivery[];
  suppliers: Supplier[];
  logWastage: (alertId: string) => void;
  applyDiscount: (alertId: string) => void;
  markReordered: (alertId: string) => void;
  updateInventory: (sku: string, amount: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (sku: string) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  registerSale: (sku: string, quantity: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [todaySales, setTodaySales] = useState<ProductSale[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<PendingDelivery[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProducts(data.products || []);
            setInventory(data.inventory || []);
            setExpiryAlerts(data.expiryAlerts || []);
            setReorderAlerts(data.reorderAlerts || []);
            setForecastData(data.forecastData || []);
            setTodaySales(data.todaySales || []);
            setPendingDeliveries(data.pendingDeliveries || []);
            setSuppliers(data.suppliers || []);
          } else {
            // New user, states are already empty
            setProducts([]);
            setInventory([]);
            setExpiryAlerts([]);
            setReorderAlerts([]);
            setForecastData([]);
            setTodaySales([]);
            setPendingDeliveries([]);
            setSuppliers([]);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      } else {
        setUserId(null);
        setProducts([]);
        setInventory([]);
        setExpiryAlerts([]);
        setReorderAlerts([]);
        setForecastData([]);
        setTodaySales([]);
        setPendingDeliveries([]);
        setSuppliers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync to firestore whenever states change
  useEffect(() => {
    if (!userId || loading) return;
    const syncData = async () => {
      try {
        await setDoc(doc(db, 'users', userId), {
          products,
          inventory,
          expiryAlerts,
          reorderAlerts,
          forecastData,
          todaySales,
          pendingDeliveries,
          suppliers
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    
    // We debounce slightly to avoid writing on every single state change when they happen together
    const timeoutId = setTimeout(syncData, 500);
    return () => clearTimeout(timeoutId);
  }, [userId, loading, products, inventory, expiryAlerts, reorderAlerts, forecastData, todaySales, pendingDeliveries, suppliers]);


  const logWastage = (alertId: string) => {
    const alert = expiryAlerts.find(a => a.id === alertId);
    if (alert) {
      // Find and deduct from inventory batch
      setInventory(prev => {
        return prev.map(inv => {
          if (inv.sku === alert.sku && inv.batchNumber === alert.batchNumber) {
            return { ...inv, currentStock: Math.max(0, inv.currentStock - alert.currentQty) };
          }
          return inv;
        });
      });
      // Remove alert
      setExpiryAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  };

  const applyDiscount = (alertId: string) => {
    // For prototype purposes, just remove from alerts to mark as "actioned"
    setExpiryAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const markReordered = (alertId: string) => {
    // In a real app we'd create a purchase order, here we just acknowledge the alert by dismissing it
    const alert = reorderAlerts.find(a => a.id === alertId);
    if (alert) {
      const product = products.find(p => p.sku === alert.sku);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const delivery: PendingDelivery = {
        id: `DEL_${Math.floor(Math.random() * 10000)}`,
        sku: alert.sku,
        productName: product ? product.name : alert.sku,
        quantity: alert.recommendedOrderQty,
        expectedDelivery: tomorrow.toISOString(),
      };
      
      setPendingDeliveries(prev => [delivery, ...prev]);
    }
    setReorderAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const updateInventory = (sku: string, diff: number) => {
    // Increment or decrement the first batch for simplicity
    setInventory(prev => {
      const copy = [...prev];
      const index = copy.findIndex(inv => inv.sku === sku);
      if (index >= 0) {
        copy[index] = { ...copy[index], currentStock: Math.max(0, copy[index].currentStock + diff) };
      }
      return copy;
    });
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.sku === product.sku ? product : p));
  };

  const deleteProduct = (sku: string) => {
    setProducts(prev => prev.filter(p => p.sku !== sku));
    setInventory(prev => prev.filter(i => i.sku !== sku));
    setExpiryAlerts(prev => prev.filter(a => a.sku !== sku));
    setReorderAlerts(prev => prev.filter(a => a.sku !== sku));
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [supplier, ...prev]);
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const registerSale = (sku: string, quantity: number) => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;

    const revenue = product.price * quantity;
    const profit = revenue - (product.unitCost * quantity);

    setTodaySales(prev => {
      const existing = prev.find(s => s.sku === sku);
      if (existing) {
        return prev.map(s => s.sku === sku ? {
          ...s,
          qtySold: s.qtySold + quantity,
          revenue: s.revenue + revenue,
          profit: s.profit + profit
        } : s);
      } else {
        return [...prev, { sku, qtySold: quantity, revenue, profit }];
      }
    });

    updateInventory(sku, -quantity);
  };

  return (
    <StoreContext.Provider value={{
      products,
      inventory,
      expiryAlerts,
      reorderAlerts,
      forecastData,
      todaySales,
      pendingDeliveries,
      suppliers,
      logWastage,
      applyDiscount,
      markReordered,
      updateInventory,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      registerSale
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
