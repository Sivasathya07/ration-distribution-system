import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

const ShopComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/complaints');
      setComplaints(data.data || []);
    } catch (err) {
      if (err.response?.status !== 404 && err.response?.status !== 400) toast.error('Failed to load complaints');
    } finally { setLoading(false); }
  };

  const handleRespond = async (id, response) => {
    const text = prompt('Enter your response:');
    if (!text) return;
    try {
      await axios.put(`/api/complaints/${id}`, { status: response, resolution: text });
      toast.success('Response submitted');
      fetchComplaints();
    } catch {
      toast.error('Failed to respond');
    }
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock },
    'in-progress': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: MessageSquare },
    resolved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Complaints About Your Shop</h1>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const cfg = statusConfig[c.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={c._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{c.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      By: {c.submittedBy?.name} • {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {c.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{c.description}</p>
                {c.resolution && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Resolution:</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{c.resolution}</p>
                  </div>
                )}
                {c.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(c._id, 'resolved')}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      Resolve
                    </button>
                    <button onClick={() => handleRespond(c._id, 'in-progress')}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Respond
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopComplaints;
