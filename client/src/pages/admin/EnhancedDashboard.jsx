import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [shopPerformance, setShopPerformance] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, trendsRes, performanceRes, fraudRes, stockRes] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/analytics/trends'),
        axios.get('/api/analytics/shop-performance'),
        axios.get('/api/analytics/fraud-detection'),
        axios.get('/api/stock/low-stock')
      ]);

      setStats(statsRes.data.data);
      setTrends(trendsRes.data.data);
      setShopPerformance(performanceRes.data.data);
      setFraudAlerts(fraudRes.data.data);
      setLowStock(stockRes.data.data);
      
      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'distribution', message: 'New distribution recorded at Delhi Central Shop', time: '2 minutes ago', icon: Package, color: 'text-green-600' },
        { id: 2, type: 'user', message: 'New beneficiary registered: Amit Kumar', time: '5 minutes ago', icon: Users, color: 'text-blue-600' },
        { id: 3, type: 'stock', message: 'Low stock alert: Mumbai West Shop - Rice', time: '10 minutes ago', icon: AlertTriangle, color: 'text-orange-600' },
        { id: 4, type: 'fraud', message: 'Fraud attempt detected and blocked', time: '15 minutes ago', icon: Shield, color: 'text-red-600' },
        { id: 5, type: 'shop', message: 'New shop registered: Bangalore South', time: '1 hour ago', icon: Store, color: 'text-purple-600' }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const trendChartData = {
    labels: trends.map(t => t._id),
    datasets: [
      {
        label: 'Distributions',
        data: trends.map(t => t.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Amount (₹)',
        data: trends.map(t => t.totalAmount / 1000),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const performanceChartData = {
    labels: shopPerformance.slice(0, 10).map(s => s.shopName),
    datasets: [
      {
        label: 'Distributions',
        data: shopPerformance.slice(0, 10).map(s => s.totalDistributions),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
        ]
      }
    ]
  };

  const stockDistributionData = {
    labels: ['Rice', 'Wheat', 'Sugar', 'Kerosene', 'Cooking Oil'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      }
    ]
  };

  const quickStats = [
    {
      title: 'Total Shops',
      value: stats?.totalShops || 0,
      change: '+12%',
      changeType: 'increase',
      icon: Store,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Beneficiaries',
      value: stats?.totalBeneficiaries || 0,
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Distributions',
      value: stats?.monthlyDistributions || 0,
      change: '+15%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Shopkeepers',
      value: stats?.totalShopkeepers || 0,
      change: '+5%',
      changeType: 'increase',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive overview of the ration distribution system
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button 
            onClick={fetchDashboardData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'activities', label: 'Activities', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribution Trends</h3>
                  <Line data={trendChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Stock Distribution</h3>
                  <Doughnut data={stockDistributionData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shop Performance</h3>
                <Bar data={performanceChartData} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {/* Fraud Alerts */}
              {fraudAlerts.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Fraud Alerts</h3>
                    <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                      {fraudAlerts.length} Active
                    </span>
                  </div>
                  <div className="space-y-3">
                    {fraudAlerts.slice(0, 5).map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {alert.beneficiaryDetails.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Multiple distributions detected: {alert.count} times
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Stock Alerts */}
              {lowStock.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Low Stock Alerts</h3>
                    <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                      {lowStock.length} Shops
                    </span>
                  </div>
                  <div className="space-y-3">
                    {lowStock.slice(0, 5).map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {stock.shop.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stock.lowItems.map(item => `${item.name}: ${item.quantity}${item.unit}`).join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                            Allocate Stock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activities</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Activities</option>
                    <option value="distribution">Distributions</option>
                    <option value="user">User Management</option>
                    <option value="stock">Stock Management</option>
                    <option value="fraud">Fraud Alerts</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-').replace('-600', '-100')} dark:${activity.color.replace('text-', 'bg-').replace('-600', '-900/20')}`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-white font-medium">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;