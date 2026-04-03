import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Trash2, Eye, Filter, Plus, Store, UserPlus } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const roleVariant = { admin: 'purple', shopkeeper: 'info', beneficiary: 'success' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [assignModal, setAssignModal] = useState(null); // user to assign shop
  const [addModal, setAddModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', address: '', rationCardNumber: '', familyMembers: 1, rationCardType: 'BPL' });

  const fetchData = async () => {
    try {
      const [uRes, sRes] = await Promise.all([
        api.get(`/users${roleFilter ? `?role=${roleFilter}` : ''}`),
        api.get('/shops')
      ]);
      setUsers(uRes.data.data);
      setShops(sRes.data.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [roleFilter]);

  const approve = async (id) => {
    try { await api.put(`/users/${id}/approve`); toast.success('User approved'); fetchData(); }
    catch { toast.error('Failed to approve'); }
  };

  const toggleActive = async (id, current) => {
    try { await api.put(`/users/${id}`, { isActive: !current }); toast.success(`User ${current ? 'deactivated' : 'activated'}`); fetchData(); }
    catch { toast.error('Failed to update'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleAssignShop = async () => {
    if (!selectedShop) return toast.error('Select a shop');
    try {
      await api.put(`/users/${assignModal._id}/assign-shop`, { shopId: selectedShop });
      toast.success(`${assignModal.name} assigned to shop`);
      setAssignModal(null);
      setSelectedShop('');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to assign'); }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { ...newUser, role: 'beneficiary' });
      toast.success('Beneficiary added successfully');
      setAddModal(false);
      setNewUser({ name: '', email: '', password: '', phone: '', address: '', rationCardNumber: '', familyMembers: 1, rationCardType: 'BPL' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add beneficiary'); }
  };

  const getShopName = (user) => {
    if (!user.shop) return <span className="text-gray-400 text-xs italic">Not assigned</span>;
    const shop = typeof user.shop === 'object' ? user.shop : shops.find(s => s._id === user.shop);
    return <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{shop?.name || 'Assigned'}</span>;
  };

  const filtered = users.filter(u => !roleFilter || u.role === roleFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="shopkeeper">Shopkeeper</option>
              <option value="beneficiary">Beneficiary</option>
            </select>
          </div>
          <button onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium text-sm">
            <UserPlus className="w-4 h-4" /> Add Beneficiary
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Beneficiaries', count: users.filter(u => u.role === 'beneficiary').length, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
          { label: 'Unassigned Beneficiaries', count: users.filter(u => u.role === 'beneficiary' && !u.shop).length, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
          { label: 'Pending Approval', count: users.filter(u => !u.isApproved).length, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Name', 'Email', 'Role', 'Phone', 'Assigned Shop', 'Status', 'Approved', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={roleVariant[u.role]}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getShopName(u)}
                        {u.role === 'beneficiary' && (
                          <button onClick={() => { setAssignModal(u); setSelectedShop(u.shop?._id || u.shop || ''); }}
                            className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Assign/Change Shop">
                            <Store className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={u.isApproved ? 'success' : 'warning'}>{u.isApproved ? 'Approved' : 'Pending'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100" title="View"><Eye className="w-4 h-4" /></button>
                        {!u.isApproved && <button onClick={() => approve(u._id)} className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 hover:bg-green-100" title="Approve"><UserCheck className="w-4 h-4" /></button>}
                        <button onClick={() => toggleActive(u._id, u.isActive)} className="p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-100" title={u.isActive ? 'Deactivate' : 'Activate'}><UserX className="w-4 h-4" /></button>
                        <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">No users found</div>
            )}
          </div>
        )}
      </div>

      {/* View User Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="User Details">
        {selected && (
          <div className="space-y-2 text-sm">
            {[
              ['Name', selected.name], ['Email', selected.email], ['Role', selected.role],
              ['Phone', selected.phone], ['Address', selected.address],
              ['District', selected.district], ['State', selected.state],
              ['Ration Card', selected.rationCardNumber || 'N/A'],
              ['Card Type', selected.rationCardType || 'N/A'],
              ['Family Members', selected.familyMembers],
              ['Assigned Shop', selected.shop?.name || 'Not assigned'],
              ['Approved', selected.isApproved ? 'Yes' : 'Pending'],
              ['Status', selected.isActive ? 'Active' : 'Inactive'],
              ['Joined', new Date(selected.createdAt).toLocaleDateString('en-IN')]
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{k}</span>
                <span className="text-gray-900 dark:text-white">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Assign Shop Modal */}
      <Modal isOpen={!!assignModal} onClose={() => { setAssignModal(null); setSelectedShop(''); }} title="Assign Shop to Beneficiary">
        {assignModal && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="font-semibold text-gray-800 dark:text-white">{assignModal.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{assignModal.email}</p>
              {assignModal.shop && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Currently assigned: {assignModal.shop?.name || 'Unknown shop'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Ration Shop</label>
              <select value={selectedShop} onChange={e => setSelectedShop(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select a shop --</option>
                {shops.map(s => (
                  <option key={s._id} value={s._id}>{s.name} — {s.district} ({s.beneficiariesCount || 0} beneficiaries)</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setAssignModal(null); setSelectedShop(''); }}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={handleAssignShop}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                <Store className="w-4 h-4" /> Assign Shop
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Beneficiary Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Beneficiary" size="lg">
        <form onSubmit={handleAddBeneficiary} className="grid grid-cols-2 gap-4">
          {[
            ['name', 'Full Name', 'text'], ['email', 'Email', 'email'],
            ['password', 'Password', 'password'], ['phone', 'Phone', 'tel'],
            ['rationCardNumber', 'Ration Card Number', 'text'],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} required value={newUser[key]} onChange={e => setNewUser(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Family Members</label>
            <input type="number" min="1" max="20" required value={newUser.familyMembers} onChange={e => setNewUser(p => ({ ...p, familyMembers: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Type</label>
            <select value={newUser.rationCardType} onChange={e => setNewUser(p => ({ ...p, rationCardType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
              <option value="BPL">BPL (Below Poverty Line)</option>
              <option value="APL">APL (Above Poverty Line)</option>
              <option value="AAY">AAY (Antyodaya Anna Yojana)</option>
              <option value="PHH">PHH (Priority Household)</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea rows={2} required value={newUser.address} onChange={e => setNewUser(p => ({ ...p, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={() => setAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" /> Add Beneficiary
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
