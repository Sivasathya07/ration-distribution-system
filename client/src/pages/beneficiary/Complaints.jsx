import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const statusVariant = { pending: 'warning', under_review: 'info', resolved: 'success', rejected: 'danger' };

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ shop: '', category: 'stock_shortage', title: '', description: '', priority: 'medium' });

  useEffect(() => {
    api.get('/complaints').then(r => setComplaints(r.data.data)).catch(() => {});
    api.get('/shops').then(r => setShops(r.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', form);
      toast.success('Complaint submitted!');
      setShowForm(false);
      setForm({ shop: '', category: 'stock_shortage', title: '', description: '', priority: 'medium' });
      const r = await api.get('/complaints');
      setComplaints(r.data.data);
    } catch { toast.error('Failed to submit'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Complaints</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No complaints submitted yet</p>
          </div>
        ) : complaints.map(c => (
          <div key={c._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
              <Badge variant={statusVariant[c.status]}>{c.status?.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{c.category?.replace('_', ' ')}</span>
              <span>•</span>
              <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              {c.shop && <><span>•</span><span>{c.shop.name}</span></>}
            </div>
            {c.resolution && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-400">
                <strong>Resolution:</strong> {c.resolution}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Submit Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop (Optional)</label>
            <select value={form.shop} onChange={e => setForm(p => ({ ...p, shop: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Select shop...</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {['stock_shortage','quality_issue','overcharging','misbehavior','fraud','other'].map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;
