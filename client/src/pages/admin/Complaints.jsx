import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const statusVariant = { pending: 'warning', under_review: 'info', resolved: 'success', rejected: 'danger' };
const priorityVariant = { low: 'gray', medium: 'info', high: 'warning', critical: 'danger' };

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resolution, setResolution] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/complaints/${selected._id}`, { status, resolution });
      toast.success('Complaint updated');
      setSelected(null);
      fetchComplaints();
    } catch { toast.error('Failed to update'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'submittedBy', label: 'Submitted By', render: v => v?.name || '-' },
    { key: 'shop', label: 'Shop', render: v => v?.name || '-' },
    { key: 'category', label: 'Category', render: v => v?.replace('_', ' ') },
    { key: 'priority', label: 'Priority', render: v => <Badge variant={priorityVariant[v]}>{v}</Badge> },
    { key: 'status', label: 'Status', render: v => <Badge variant={statusVariant[v]}>{v?.replace('_', ' ')}</Badge> },
    { key: 'createdAt', label: 'Date', render: v => new Date(v).toLocaleDateString() },
    { key: '_id', label: 'Action', searchable: false, render: (id, row) => (
      <button onClick={() => { setSelected(row); setStatus(row.status); setResolution(row.resolution || ''); }}
        className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
        Manage
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Management</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {loading ? <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          : <Table columns={columns} data={complaints} />}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Manage Complaint">
        {selected && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-2 text-sm">
              <p><span className="text-gray-500">Title:</span> <span className="font-medium text-gray-900 dark:text-white">{selected.title}</span></p>
              <p><span className="text-gray-500">Description:</span> <span className="text-gray-700 dark:text-gray-300">{selected.description}</span></p>
              <p><span className="text-gray-500">By:</span> <span className="text-gray-700 dark:text-gray-300">{selected.submittedBy?.name}</span></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {['pending', 'under_review', 'resolved', 'rejected'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolution Note</label>
              <textarea rows={3} value={resolution} onChange={e => setResolution(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium">Update</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
