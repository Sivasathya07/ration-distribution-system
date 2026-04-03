import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, MapPin } from 'lucide-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', shopNumber: '', ownerId: '', address: '', district: '', state: '', pincode: '', phone: '', licenseNumber: '' });

  const fetchData = async () => {
    try {
      const [s, u] = await Promise.all([api.get('/shops'), api.get('/users?role=shopkeeper')]);
      setShops(s.data.data);
      setShopkeepers(u.data.data.filter(u => !u.shop));
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shops', form);
      toast.success('Shop created!');
      setShowForm(false);
      setForm({ name: '', shopNumber: '', ownerId: '', address: '', district: '', state: '', pincode: '', phone: '', licenseNumber: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create shop'); }
  };

  const deleteShop = async (id) => {
    if (!window.confirm('Delete this shop?')) return;
    try { await api.delete(`/shops/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'name', label: 'Shop Name' },
    { key: 'shopNumber', label: 'Shop No.' },
    { key: 'owner', label: 'Owner', render: v => v?.name || '-' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    { key: 'beneficiariesCount', label: 'Beneficiaries' },
    { key: 'rating', label: 'Rating', render: v => <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{v || 0}</span> },
    { key: 'isActive', label: 'Status', render: v => <Badge variant={v ? 'success' : 'danger'}>{v ? 'Active' : 'Inactive'}</Badge> },
    { key: '_id', label: 'Actions', searchable: false, render: (id) => (
      <button onClick={() => deleteShop(id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
    )}
  ];

  const fields = [
    ['name', 'Shop Name', 'text'], ['shopNumber', 'Shop Number', 'text'],
    ['address', 'Address', 'text'], ['district', 'District', 'text'],
    ['state', 'State', 'text'], ['pincode', 'Pincode', 'text'],
    ['phone', 'Phone', 'tel'], ['licenseNumber', 'License Number', 'text']
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{shops.length} shops registered</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" /> Add Shop
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {loading ? <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          : <Table columns={columns} data={shops} />}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Shop" size="lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Shopkeeper</label>
            <select required value={form.ownerId} onChange={e => setForm(p => ({ ...p, ownerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
              <option value="">Select shopkeeper...</option>
              {shopkeepers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium">Create Shop</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shops;
