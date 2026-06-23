import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function DailyReportView() {
  const { todaySales, products } = useStore();

  const totalRevenue = todaySales.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = todaySales.reduce((sum, item) => sum + item.profit, 0);
  const totalItems = todaySales.reduce((sum, item) => sum + item.qtySold, 0);
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full print:bg-white print:text-black print:p-0">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Daily Sales Statistics</h1>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium transition-colors"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>

      {/* Printable Area Starts Here */}
      <div className="print:block print:w-full">
        <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Main Supermarket</h1>
          <h2 className="text-xl font-medium mt-1">Daily Sales Report</h2>
          <p className="text-sm mt-2">{dateStr}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-4 print:mb-6">
          <Card className="print:border-black print:shadow-none print:rounded-none">
            <CardHeader className="pb-2 print:p-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider print:text-black print:text-xs">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="print:px-3 print:pb-3">
              <div className="text-2xl font-bold text-slate-900 print:text-lg">
                ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card className="print:border-black print:shadow-none print:rounded-none">
            <CardHeader className="pb-2 print:p-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider print:text-black print:text-xs">
                Total Units Sold
              </CardTitle>
            </CardHeader>
            <CardContent className="print:px-3 print:pb-3">
              <div className="text-2xl font-bold text-slate-900 print:text-lg">
                {totalItems.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
          <Card className="print:border-black print:shadow-none print:rounded-none">
            <CardHeader className="pb-2 print:p-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider print:text-black print:text-xs">
                Estimated Profit
              </CardTitle>
            </CardHeader>
            <CardContent className="print:px-3 print:pb-3">
              <div className="text-2xl font-bold text-emerald-600 print:text-lg print:text-black">
                ₹{totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="print:border-none print:shadow-none w-full border-slate-200">
          <CardHeader className="print:px-0">
            <CardTitle>Sales Breakdown by Product</CardTitle>
          </CardHeader>
          <CardContent className="p-0 print:p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left print:text-xs">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b print:bg-white print:text-black print:border-black">
                  <tr>
                    <th className="px-6 py-3 print:px-2 print:py-2">SKU</th>
                    <th className="px-6 py-3 print:px-2 print:py-2">Product Name</th>
                    <th className="px-6 py-3 text-right print:px-2 print:py-2">Qty Sold</th>
                    <th className="px-6 py-3 text-right print:px-2 print:py-2">Revenue (₹)</th>
                    <th className="px-6 py-3 text-right print:px-2 print:py-2">Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-gray-300">
                  {todaySales.map((sale) => {
                    const product = products.find(p => p.sku === sale.sku);
                    return (
                      <tr key={sale.sku} className="hover:bg-slate-50 print:hover:bg-white">
                        <td className="px-6 py-4 font-mono text-slate-500 print:px-2 print:py-2">{sale.sku}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 print:px-2 print:py-2">{product?.name}</td>
                        <td className="px-6 py-4 text-right font-medium print:px-2 print:py-2">{sale.qtySold}</td>
                        <td className="px-6 py-4 text-right text-slate-600 print:px-2 print:py-2">{sale.revenue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="px-6 py-4 text-right text-emerald-600 print:text-black print:px-2 print:py-2">{sale.profit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="hidden print:block text-center mt-12 text-xs text-gray-500">
          — End of Report —
        </div>
      </div>
    </div>
  );
}
