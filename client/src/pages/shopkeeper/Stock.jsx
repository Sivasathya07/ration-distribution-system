import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Package, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';

const ShopStock = () => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStock(); }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/stock/my-stock');
      setStock(data.data);
    } catch {
      toast.error('Failed to load stock');
    } finally { setLoading(false); }
  };

  const getStatusColor = (remaining, allocated) => {
    const pct = allocated > 0 ? (remaining / allocated) * 100 : 0;
    if (remaining <= 0) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (pct <= 20) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  };

  const getStatusLabel = (remaining, allocated) => {
    const pct = allocated > 0 ? (remaining / allocated) * 100 : 0;
    if (remaining <= 0) return 'Out of Stock';
    if (pct <= 20) return 'Low Stock';
    return 'In Stock';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  const lowItems = stock?.items?.filter(i => {
    const pct = i.allocated > 0 ? (i.remaining / i.allocated) * 100 : 0;
    return pct <= 20;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stock Management</h1>
        <button onClick={fetchStock} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {lowItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Low Stock Alert</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {lowItems.map(i => i.name).join(', ')} — running low. Contact admin for restocking.
            </p>
          </div>
        </div>
      )}

      {!stock ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No stock allocated for this month</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Contact admin to allocate stock</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">
                {stock.month} {stock.year} — Stock Inventory
              </h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(stock.updatedAt || stock.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Item', 'Allocated', 'Distributed', 'Remaining', 'Unit', 'Price/Unit', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stock.items?.map((item, i) => {
                  const pct = item.allocated > 0 ? (item.remaining / item.allocated) * 100 : 0;
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.allocated}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.distributed || 0}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          {pct <= 20 && <TrendingDown className="w-4 h-4 text-red-500" />}
                          <span className={pct <= 20 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>{item.remaining}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.unit}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">₹{item.pricePerUnit}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.remaining, item.allocated)}`}>
                          {getStatusLabel(item.remaining, item.allocated)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Progress bars */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stock.items?.map((item, i) => {
              const pct = item.allocated > 0 ? Math.round((item.remaining / item.allocated) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{pct}% left</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopStock;
