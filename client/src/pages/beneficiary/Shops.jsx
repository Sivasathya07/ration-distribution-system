import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Store, MapPin, Phone, Mail, Star, Clock, Search, CheckCircle } from 'lucide-react';

const BeneficiaryShops = () => {
  const [shops, setShops] = useState([]);
  const [myShop, setMyShop] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        axios.get('/shops'),
        axios.get('/users/my-shop').catch(() => ({ data: { data: null } }))
      ]);
      setShops(sRes.data.data || []);
      setMyShop(mRes.data.data);
    } catch {
      toast.error('Failed to load shops');
    } finally { setLoading(false); }
  };

  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.address || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.district || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Shop Locator</h1>

      {/* My Assigned Shop */}
      {myShop && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <p className="font-semibold text-blue-800 dark:text-blue-200">Your Assigned Shop</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">{myShop.name}</h3>
              {myShop.shopNumber && <p className="text-sm text-blue-700 dark:text-blue-300">Shop #{myShop.shopNumber}</p>}
              {myShop.address && (
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <MapPin className="w-3.5 h-3.5" />{myShop.address}
                </div>
              )}
              {myShop.phone && (
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Phone className="w-3.5 h-3.5" />{myShop.phone}
                </div>
              )}
              {myShop.operatingHours && (
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Clock className="w-3.5 h-3.5" />
                  {myShop.operatingHours.open} – {myShop.operatingHours.close}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search shops by name, address, or district..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* All Shops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(shop => {
          const isMyShop = myShop?._id === shop._id;
          return (
            <div key={shop._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow border-2 ${isMyShop ? 'border-blue-500' : 'border-transparent'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isMyShop ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Store className={`w-5 h-5 ${isMyShop ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{shop.name}</h3>
                    {isMyShop && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Your Shop</span>
                    )}
                  </div>
                  {shop.district && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{shop.district}, {shop.state}</p>}
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                {shop.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />{shop.phone}
                  </div>
                )}
                {shop.operatingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {shop.operatingHours.open} – {shop.operatingHours.close}
                  </div>
                )}
              </div>

              {shop.rating > 0 && (
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(shop.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{shop.rating?.toFixed(1)}</span>
                </div>
              )}

              <div className="mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${shop.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                  {shop.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No shops found</p>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryShops;
