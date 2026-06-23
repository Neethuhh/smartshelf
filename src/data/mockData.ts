import { addDays, format, subDays } from 'date-fns';
import { 
  Store, Supplier, Product, Category, InventoryItem, 
  ExpiryAlert, ReorderAlert, DailySalesAgg, ForecastData, WastageLog, ProductSale 
} from '../types';

export const STORES: Store[] = [
  { id: 'S1', name: 'Main Supermarket', type: 'retail', address: '12 Main St', capacity: 25000 }
];

export const SUPPLIERS: Supplier[] = [
  { id: 'SUP_F01', name: 'Valley Fresh Farms', leadTimeDays: 2, phone: '+1 555-0101' },
  { id: 'SUP_D01', name: 'Meadowlands Dairy', leadTimeDays: 1, phone: '+1 555-0102' },
  { id: 'SUP_M01', name: 'Premium Meats Co', leadTimeDays: 2, phone: '+1 555-0103' },
  { id: 'SUP_B01', name: 'Sunrise Bakery', leadTimeDays: 1, phone: '+1 555-0104' },
  { id: 'SUP_B02', name: 'Global Bev Dist', leadTimeDays: 5, phone: '+1 555-0105' },
  { id: 'SUP_P01', name: 'MegaPack FMCG', leadTimeDays: 7, phone: '+1 555-0106' },
];

const categoryDefs: { cat: Category, shelfLife: [number, number], cost: [number, number], sup: string, timeSensitive: boolean, names: string[] }[] = [
  { cat: 'Fresh Produce', shelfLife: [3, 7], cost: [0.5, 4], sup: 'SUP_F01', timeSensitive: true, names: ["Organic Bananas"] },
  { cat: 'Dairy & Eggs', shelfLife: [7, 21], cost: [1.5, 6], sup: 'SUP_D01', timeSensitive: true, names: ["Whole Milk 1 Gal"] },
  { cat: 'Meat & Seafood', shelfLife: [2, 5], cost: [4, 15], sup: 'SUP_M01', timeSensitive: true, names: ["Atlantic Salmon Fillet"] },
  { cat: 'Bakery', shelfLife: [1, 3], cost: [1, 5], sup: 'SUP_B01', timeSensitive: true, names: ["Sourdough Loaf"] },
  { cat: 'Beverages', shelfLife: [180, 365], cost: [0.8, 12], sup: 'SUP_B02', timeSensitive: false, names: ["Orange Juice 1L"] },
];

export const PRODUCTS: Product[] = [];
let skuCounter = 1000;

categoryDefs.forEach(def => {
  def.names.forEach(name => {
    const cost = Number((Math.random() * (def.cost[1] - def.cost[0]) + def.cost[0]).toFixed(2));
    const price = Number((cost * (1.3 + Math.random() * 0.4)).toFixed(2));
    const shelfLife = Math.floor(Math.random() * (def.shelfLife[1] - def.shelfLife[0] + 1)) + def.shelfLife[0];
    
    PRODUCTS.push({
      sku: `SKU-${def.cat.substring(0,2).toUpperCase()}-${skuCounter++}`,
      name: name,
      category: def.cat,
      unitCost: cost,
      sellingPrice: price,
      unit: def.cat === 'Beverages' ? 'litre' : def.cat === 'Fresh Produce' ? 'kg' : 'pack',
      isTimeSensitive: def.timeSensitive,
      shelfLifeDays: shelfLife,
      minOrderQty: def.timeSensitive ? 20 : 100,
      supplierId: def.sup,
    });
  });
});

const today = new Date();

export const INVENTORY: InventoryItem[] = [];
export const EXPIRY_ALERTS: ExpiryAlert[] = [];
export const REORDER_ALERTS: ReorderAlert[] = [];
export const WASTAGE_LOGS: WastageLog[] = [];

let alertIdCounter = 1;
let invIdCounter = 10000;

PRODUCTS.forEach(product => {
  STORES.forEach(store => {
    const numBatches = 1;
    
    for (let b = 0; b < numBatches; b++) {
      const stock = Math.floor(Math.random() * 30) + 5; // Low stock to trigger reorder
      
      // Force expiry to be within 14 days to trigger an alert
      let daysToExpiry = Math.floor(Math.random() * 14); 
      
      const expiryDate = addDays(today, daysToExpiry);
      const batchNumber = `BTH-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      
      INVENTORY.push({
        id: `INV-${invIdCounter++}`,
        sku: product.sku,
        storeId: store.id,
        currentStock: stock,
        batchNumber,
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
        lastRestocked: format(subDays(today, Math.floor(Math.random() * 10)), 'yyyy-MM-dd')
      });
      
      // Generate Expiry Alerts
      let alertType: ExpiryAlert['alertType'] = 'notice_14days';
      if (daysToExpiry <= 3) alertType = 'critical_3days';
      else if (daysToExpiry <= 7) alertType = 'warning_7days';
      
      EXPIRY_ALERTS.push({
        id: `EA-${alertIdCounter++}`,
        sku: product.sku,
        storeId: store.id,
        batchNumber,
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
        daysUntilExpiry: daysToExpiry,
        currentQty: stock,
        alertType
      });
      
      // Generate Wastage for half the items
      if (Math.random() > 0.5) {
        WASTAGE_LOGS.push({
          id: `WST-${alertIdCounter++}`,
          sku: product.sku,
          storeId: store.id,
          quantityWasted: stock,
          date: format(today, 'yyyy-MM-dd'),
          reason: 'Expired',
          cost: Number((stock * product.unitCost).toFixed(2))
        });
      }
    }
    
    // Aggregated stock for reorder alerts
    const totalStock = INVENTORY.filter(i => i.sku === product.sku && i.storeId === store.id)
                                .reduce((sum, i) => sum + i.currentStock, 0);
                                
    const reorderPoint = 40;
    
    const urgency = 'critical';
    REORDER_ALERTS.push({
      id: `RA-${alertIdCounter++}`,
      sku: product.sku,
      storeId: store.id,
      currentStock: totalStock,
      reorderPoint,
      recommendedOrderQty: Math.max(reorderPoint * 2 - totalStock, product.minOrderQty),
      urgencyLevel: urgency,
      alertDate: format(today, 'yyyy-MM-dd')
    });
  });
});

// Generate Analytics data (Daily Sales & Forecast)
export const FORECAST_DATA: ForecastData[] = [];

// Last 30 days
for (let i = 30; i >= 0; i--) {
  const d = subDays(today, i);
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  const baseSales = 5000 + Math.random() * 1000;
  const actual = isWeekend ? baseSales * 1.4 : baseSales; // Weekend spike
  
  FORECAST_DATA.push({
    date: format(d, 'MMM dd'),
    actualSales: Math.floor(actual),
    predictedSales: Math.floor(actual * (0.95 + Math.random() * 0.1)),
    lowerBound: Math.floor(actual * 0.85),
    upperBound: Math.floor(actual * 1.15)
  });
}

// Next 14 days (Forecast only)
for (let i = 1; i <= 14; i++) {
  const d = addDays(today, i);
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  const baseSales = 5000 + Math.random() * 1000;
  const predicted = isWeekend ? baseSales * 1.4 : baseSales;
  
  FORECAST_DATA.push({
    date: format(d, 'MMM dd'),
    predictedSales: Math.floor(predicted),
    lowerBound: Math.floor(predicted * 0.8),
    upperBound: Math.floor(predicted * 1.2)
  });
}

export const TODAY_SALES: ProductSale[] = PRODUCTS.map(product => {
  const qtySold = Math.floor(Math.random() * 50) + 5;
  const revenue = Number((qtySold * product.sellingPrice).toFixed(2));
  const cost = Number((qtySold * product.unitCost).toFixed(2));
  return {
    sku: product.sku,
    qtySold,
    revenue,
    profit: Number((revenue - cost).toFixed(2))
  };
}).sort((a, b) => b.revenue - a.revenue);
