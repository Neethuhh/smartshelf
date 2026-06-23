export type Store = {
  id: string;
  name: string;
  type: 'warehouse' | 'retail';
  address: string;
  capacity: number;
};

export type Category = 
  | 'Fresh Produce' 
  | 'Dairy & Eggs' 
  | 'Meat & Seafood' 
  | 'Bakery' 
  | 'Beverages' 
  | 'Packaged/FMCG';

export type Product = {
  sku: string;
  name: string;
  category: Category;
  unitCost: number;
  sellingPrice: number;
  unit: string;
  isTimeSensitive: boolean;
  shelfLifeDays: number;
  minOrderQty: number;
  supplierId: string;
};

export type Supplier = {
  id: string;
  name: string;
  leadTimeDays: number;
  phone: string;
};

export type InventoryItem = {
  id: string;
  sku: string;
  storeId: string;
  currentStock: number;
  batchNumber: string;
  expiryDate: string; // ISO date string
  lastRestocked: string;
};

export type PendingDelivery = {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  expectedDelivery: string;
};

export type ExpiryAlert = {
  id: string;
  sku: string;
  storeId: string;
  batchNumber: string;
  expiryDate: string;
  daysUntilExpiry: number;
  currentQty: number;
  alertType: 'critical_3days' | 'warning_7days' | 'notice_14days';
};

export type ReorderAlert = {
  id: string;
  sku: string;
  storeId: string;
  currentStock: number;
  reorderPoint: number;
  recommendedOrderQty: number;
  urgencyLevel: 'critical' | 'high' | 'medium';
  alertDate: string;
};

export type DailySalesAgg = {
  date: string;
  salesVolume: number;
  revenue: number;
  isWeekend: boolean;
  isHoliday: boolean;
};

export type ForecastData = {
  date: string;
  actualSales?: number;
  predictedSales: number;
  lowerBound: number;
  upperBound: number;
};

export type ProductSale = {
  sku: string;
  qtySold: number;
  revenue: number;
  profit: number;
};

export type WastageLog = {
  id: string;
  sku: string;
  storeId: string;
  quantityWasted: number;
  date: string;
  reason: string;
  cost: number;
};
