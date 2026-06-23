import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, Trash2, Tag, CheckSquare, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useStore } from '../context/StoreContext';

export function ExpiryAlertsView({ initialFilter = 'all' }: { initialFilter?: string }) {
  const { expiryAlerts, products, logWastage, applyDiscount } = useStore();
  const [filterType, setFilterType] = useState<string>(initialFilter);
  
  const filteredAlerts = expiryAlerts.filter(a => {
    if (filterType === 'all') return true;
    return a.alertType === filterType;
  });
  
  const sortedAlerts = [...filteredAlerts].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Expiry Management</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card 
          className={`border-red-100 cursor-pointer transition-colors ${filterType === 'critical_3days' ? 'bg-red-100' : 'bg-red-50 hover:bg-red-100/50'}`}
          onClick={() => setFilterType(filterType === 'critical_3days' ? 'all' : 'critical_3days')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${filterType === 'critical_3days' ? 'bg-red-200 text-red-700' : 'bg-red-100 text-red-600'}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Critical (&lt;3 Days)</p>
                <h3 className="text-2xl font-bold text-red-700">
                  {expiryAlerts.filter(a => a.alertType === 'critical_3days').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`border-amber-100 cursor-pointer transition-colors ${filterType === 'warning_7days' ? 'bg-amber-100' : 'bg-amber-50 hover:bg-amber-100/50'}`}
          onClick={() => setFilterType(filterType === 'warning_7days' ? 'all' : 'warning_7days')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${filterType === 'warning_7days' ? 'bg-amber-200 text-amber-700' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">Warning (4-7 Days)</p>
                <h3 className="text-2xl font-bold text-amber-700">
                  {expiryAlerts.filter(a => a.alertType === 'warning_7days').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-blue-100 cursor-pointer transition-colors ${filterType === 'notice_14days' ? 'bg-blue-100' : 'bg-blue-50 hover:bg-blue-100/50'}`}
          onClick={() => setFilterType(filterType === 'notice_14days' ? 'all' : 'notice_14days')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${filterType === 'notice_14days' ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600'}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Notice (8-14 Days)</p>
                <h3 className="text-2xl font-bold text-blue-700">
                  {expiryAlerts.filter(a => a.alertType === 'notice_14days').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Product / Batch</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Expires In</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Qty</th>
                <th className="px-6 py-3 text-right font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAlerts.map(alert => {
                const product = products.find(p => p.sku === alert.sku);
                const isExpired = alert.daysUntilExpiry < 0;
                
                return (
                  <tr key={alert.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : alert.alertType === 'critical_3days' ? (
                        <Badge variant="destructive">Critical</Badge>
                      ) : alert.alertType === 'warning_7days' ? (
                        <Badge variant="warning">Warning</Badge>
                      ) : (
                        <Badge variant="secondary">Notice</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{product?.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{alert.batchNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <span className="text-red-600 font-medium">Passed ({alert.expiryDate})</span>
                      ) : (
                        <span className="font-medium">{alert.daysUntilExpiry} days <span className="text-gray-400 font-normal">({alert.expiryDate})</span></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {alert.currentQty} {product?.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isExpired ? (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => logWastage(alert.id)}>
                          <Trash2 className="w-4 h-4 mr-1"/> Log Wastage
                        </Button>
                      ) : alert.alertType === 'critical_3days' ? (
                        <Button variant="outline" size="sm" className="text-amber-600 hover:text-amber-700" onClick={() => applyDiscount(alert.id)}>
                          <Tag className="w-4 h-4 mr-1"/> Apply Discount
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => applyDiscount(alert.id)}>
                          <CheckSquare className="w-4 h-4 mr-1"/> Mark Reviewed
                        </Button>
                      )}
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
