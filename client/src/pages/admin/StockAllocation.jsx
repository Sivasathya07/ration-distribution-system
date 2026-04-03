import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ITEMS = [
  { name: 'Rice', unit: 'kg', price: 3 },
  { name: 'Wheat', unit: 'kg', price: 2 },
  { name: 'Sugar', unit: 'kg', price: 13 },
  { name: 'Kerosene', unit: 'litre', price: 15 },
  { name: 'Cooking Oil', unit: 'litre', price: 40 },
  { name: 'Dal', unit: 'kg', price: 20 },
  { name: 'Salt', unit: 'kg', price: 5 },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const StockAllocation = () => {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ shopId: '', month: MONTHS[new Date().getMonth()], year: new Date().getFullYear(), items: ITEMS.map(i => ({ ...i, quantity: 0 })) });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/shops').then(r => setShops(r.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopId) return toast.error('Select a shop');
    setLoading(true);
    try {
      const { data } = await api.post('/stock/allocate', {
        shopId: form.shopId,
        items: form.items.filter(i => i.quantity > 0),
        month: form.month,
        year: form.year
      });
      toast.success('Stock allocated successfully!');
      setForm(p => ({ ...p, shopId: '', items: ITEMS.map(i => ({ ...i, quantity: 0 })) }));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to allocate'); }
    finally { setLoading(false); }
  };

  const updateQty = (idx, val) => {
    setForm(p => ({ ...p, items: p.items.map((item, i) => i === idx ? { ...item, quantity: parseFloat(val) || 0 } : item) }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Allocation</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Allocation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" /> Allocate Stock
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Shop</label>
              <select required value={form.shopId} onChange={e => setForm(p => ({ ...p, shopId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Choose shop...</option>
                {shops.map(s => <option key={s._id} value={s._id}>{s.name} ({s.shopNumber})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                <select value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Items & Quantities</label>
              {form.items.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28">{item.name}</span>
                  <span className="text-xs text-gray-400 w-12">{item.unit}</span>
                  <input type="number" min="0" value={item.quantity || ''} placeholder="0"
                    onChange={e => updateQty(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-60">
              {loading ? 'Allocating...' : 'Allocate Stock'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockAllocation;
