import React, { useState, useEffect } from 'react';
import { Users, Package, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ShopkeeperDashboard = () => {
  const [stats, setStats] = useState({});
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/distribution?limit=5'),
    ]).then(([s, d]) => {
      setStats(s.data.data);
      setDistributions(d.data.data);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const stockChartData = stats.currentStock?.map(i => ({ name: i.name, remaining: i.remaining, allocated: i.allocated })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="My Beneficiaries" value={stats.shopBeneficiaries || 0} icon={Users} color="blue" />
        <StatCard title="This Month Distributed" value={stats.monthlyDistributions || 0} icon={CheckCircle} color="green" />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints || 0} icon={AlertTriangle} color="red" />
      </div>

      {/* Stock Overview */}
      {stockChartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" /> Current Stock Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="allocated" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Allocated" />
              <Bar dataKey="remaining" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {stats.currentStock?.map(item => (
              <div key={item.name} className={`p-3 rounded-xl text-center ${item.remaining < 50 ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
                <p className={`text-lg font-bold ${item.remaining < 50 ? 'text-red-600' : 'text-green-600'}`}>{item.remaining}</p>
                <p className="text-xs text-gray-400">{item.unit}</p>
                {item.remaining < 50 && <p className="text-xs text-red-500 font-medium mt-1">⚠ Low</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Distributions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" /> Recent Distributions
        </h3>
        {distributions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No distributions yet this month</p>
        ) : (
          <div className="space-y-3">
            {distributions.map(d => (
              <div key={d._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{d.beneficiary?.name}</p>
                  <p className="text-xs text-gray-500">{d.beneficiary?.rationCardNumber} • {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">₹{d.totalAmount}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
