import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Users, Search, Phone, MapPin, CheckCircle, Clock, CreditCard } from 'lucide-react';

const ShopBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bRes, dRes] = await Promise.all([
        axios.get('/users/beneficiaries'),
        axios.get('/distribution')
      ]);
      setBeneficiaries(bRes.data.data || []);
      setDistributions(dRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load beneficiaries');
    } finally { setLoading(false); }
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const hasReceivedThisMonth = (beneficiaryId) => {
    return distributions.some(d =>
      (d.beneficiary?._id === beneficiaryId || d.beneficiary === beneficiaryId) &&
      d.month === currentMonth &&
      d.year === currentYear
    );
  };

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.rationCardNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.phone || '').includes(search)
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  const receivedCount = beneficiaries.filter(b => hasReceivedThisMonth(b._id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Beneficiaries</h1>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
            {receivedCount} received
          </span>
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
            {beneficiaries.length - receivedCount} pending
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, ration card, or phone..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No beneficiaries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => {
            const received = hasReceivedThisMonth(b._id);
            return (
              <div key={b._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{b.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{b.rationCardType || 'APL'}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${received ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                    {received ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {received ? 'Received' : 'Pending'}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {b.rationCardNumber && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{b.rationCardNumber}</span>
                    </div>
                  )}
                  {b.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{b.phone}</span>
                    </div>
                  )}
                  {b.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{b.familyMembers || 1} family member(s)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopBeneficiaries;
