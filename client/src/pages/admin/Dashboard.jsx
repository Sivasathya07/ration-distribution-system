import React, { useState, useEffect } from 'react';
import { Users, Store, Package, TrendingUp, AlertTriangle, ShieldAlert, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [trends, setTrends] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, t, p, f, ls] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/trends'),
          api.get('/analytics/shop-performance'),
          api.get('/analytics/fraud'),
          api.get('/stock/low-stock'),
        ]);
        setStats(s.data.data);
        setTrends(t.data.data);
        setPerformance(p.data.data.slice(0, 5));
        setFraudAlerts(f.data.data);
        setLowStock(ls.data.data);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pieData = [
    { name: 'Shops', value: stats.totalShops || 0 },
    { name: 'Beneficiaries', value: stats.totalBeneficiaries || 0 },
    { name: 'Shopkeepers', value: stats.totalShopkeepers || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Shops" value={stats.totalShops || 0} icon={Store} color="blue" />
        <StatCard title="Beneficiaries" value={stats.totalBeneficiaries || 0} icon={Users} color="green" />
        <StatCard title="Shopkeepers" value={stats.totalShopkeepers || 0} icon={Users} color="purple" />
        <StatCard title="Monthly Dist." value={stats.monthlyDistributions || 0} icon={Package} color="orange" />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints || 0} icon={AlertTriangle} color="red" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals || 0} icon={Clock} color="teal" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Distribution Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Distributions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shop Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Shop Performance</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={performance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="shopName" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50}
                tickFormatter={(v) => v?.length > 18 ? v.slice(0, 18) + '…' : v} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="totalDistributions" fill="#10b981" radius={[4, 4, 0, 0]} name="Distributions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fraud Alerts</h2>
            {fraudAlerts.length > 0 && <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">{fraudAlerts.length}</span>}
          </div>
          {fraudAlerts.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">No fraud detected this month</p>
            </div>
          ) : fraudAlerts.slice(0, 4).map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{a.beneficiary?.name}</p>
                <p className="text-xs text-gray-500">{a.count} distributions detected</p>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-yellow-100 dark:border-yellow-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Low Stock Alerts</h2>
            {lowStock.length > 0 && <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold">{lowStock.length}</span>}
          </div>
          {lowStock.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">All shops have sufficient stock</p>
            </div>
          ) : lowStock.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{s.shop?.name}</p>
                <p className="text-xs text-gray-500">{s.lowItems?.map(i => `${i.name}: ${i.remaining}${i.unit}`).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
