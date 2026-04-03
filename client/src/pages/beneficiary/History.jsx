import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { ClipboardList, Download, Calendar, Package, CheckCircle } from 'lucide-react';

const BeneficiaryHistory = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/distribution/my');
      setDistributions(data.data || []);
    } catch {
      toast.error('Failed to load history');
    } finally { setLoading(false); }
  };

  const downloadReceipt = async (id) => {
    try {
      const { data } = await axios.get(`/distribution/${id}/receipt`);
      // Receipt returns JSON data — open in new tab as formatted text
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id.slice(-6)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  // Build month filter options
  const months = [...new Set(distributions.map(d => {
    return `${d.year}-${d.month}`;
  }))].sort().reverse();

  const filtered = filter === 'all' ? distributions : distributions.filter(d => `${d.year}-${d.month}` === filter);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Ration History</h1>

      {/* Month filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
          All
        </button>
        {months.map(m => {
          const [yr, mo] = m.split('-');
          return (
            <button key={m} onClick={() => setFilter(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === m ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {mo} {yr}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No distribution records found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Your ration history will appear here after distribution</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(d => (
            <div key={d._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {d.shop?.name || 'Ration Shop'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {d.month} {d.year}
                      {d.receiptNumber && <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">#{d.receiptNumber}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => downloadReceipt(d._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" /> Receipt
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {d.items?.map((item, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {d.totalAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                  <span className="font-semibold text-gray-800 dark:text-white">₹{d.totalAmount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeneficiaryHistory;
