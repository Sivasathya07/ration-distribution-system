import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, CheckCircle, XCircle, RefreshCw, Plus } from 'lucide-react';

const ShopSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', startTime: '09:00', endTime: '10:00', maxBeneficiaries: 10 });

  useEffect(() => { fetchSlots(); }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/slots/my-slots');
      setSlots(data.data || []);
    } catch {
      toast.error('Failed to load slots');
    } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) return toast.error('End time must be after start time');
    setCreating(true);
    try {
      await axios.post('/slots', form);
      toast.success('Slot created successfully');
      setForm({ date: '', startTime: '09:00', endTime: '10:00', maxBeneficiaries: 10 });
      setShowForm(false);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slot');
    } finally { setCreating(false); }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await axios.put(`/slots/${id}`, { status: newStatus });
      toast.success(`Slot ${newStatus}`);
      fetchSlots();
    } catch {
      toast.error('Failed to update slot');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Slot Management</h1>
        <div className="flex gap-2">
          <button onClick={fetchSlots} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowForm(p => !p)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Slot
          </button>
        </div>
      </div>

      {/* Create Slot Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Create New Slot
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" required min={today}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input type="time" required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input type="time" required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Beneficiaries</label>
              <input type="number" min="1" max="100" required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={form.maxBeneficiaries} onChange={e => setForm({ ...form, maxBeneficiaries: parseInt(e.target.value) })} />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" disabled={creating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {creating ? 'Creating...' : 'Create Slot'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slots List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">All Slots ({slots.length})</h2>
        </div>
        {slots.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No slots created yet</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline">
              Create your first slot
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {slots.map(slot => {
              const status = slot.status || (slot.bookedCount >= slot.maxBeneficiaries ? 'full' : 'open');
              const statusColors = {
                open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                full: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
              };
              return (
                <div key={slot._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 min-w-[56px]">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {new Date(slot.date).toLocaleDateString('en', { month: 'short' })}
                      </p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {new Date(slot.date).getDate()}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {slot.startTime} – {slot.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Users className="w-3 h-3" />
                        {slot.bookedCount || 0} / {slot.maxBeneficiaries} booked
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.open}`}>
                      {status}
                    </span>
                    {status !== 'full' && (
                      <button
                        onClick={() => handleToggle(slot._id, status)}
                        className={`p-1.5 rounded-lg transition-colors ${status === 'open' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                        title={status === 'open' ? 'Close slot' : 'Open slot'}
                      >
                        {status === 'open' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSlots;
