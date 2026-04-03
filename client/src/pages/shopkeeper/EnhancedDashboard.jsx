import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Eye,
  Download,
  Bell,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Star,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import DistributionModal from '../../components/DistributionModal';

const EnhancedShopkeeperDashboard = () => {
  const [stats, setStats] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, beneficiariesRes, distributionsRes] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/users/beneficiaries'),
        axios.get('/api/distribution')
      ]);

      setStats(statsRes.data.data);
      setBeneficiaries(beneficiariesRes.data.data);
      setDistributions(distributionsRes.data.data);
      
      // Mock notifications
      setNotifications([
        { id: 1, type: 'low_stock', message: 'Rice stock is running low (45kg remaining)', time: '5 minutes ago', priority: 'high' },
        { id: 2, type: 'new_beneficiary', message: 'New beneficiary assigned: Priya Sharma', time: '1 hour ago', priority: 'medium' },
        { id: 3, type: 'monthly_target', message: 'Monthly distribution target: 85% completed', time: '2 hours ago', priority: 'low' }
      ]);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowModal(true);
  };

  const handleDistributionSuccess = () => {
    setShowModal(false);
    setSelectedBeneficiary(null);
    fetchDashboardData();
    toast.success('Distribution recorded successfully!');
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.rationCardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const hasDistribution = distributions.some(d => 
      d.beneficiary._id === beneficiary._id && 
      d.month === new Date().toLocaleString('default', { month: 'long' }) &&
      d.year === new Date().getFullYear()
    );
    
    return matchesSearch && (
      (filterStatus === 'distributed' && hasDistribution) ||
      (filterStatus === 'pending' && !hasDistribution)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stockChartData = {
    labels: stats?.currentStock?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Current Stock',
        data: stats?.currentStock?.map(item => item.quantity) || [],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      }
    ]
  };

  const distributionTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Distributions',
        data: [12, 19, 15, 22],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const quickActions = [
    { title: 'Record Distribution', icon: Plus, color: 'bg-blue-500', action: () => setActiveTab('beneficiaries') },
    { title: 'Check Stock', icon: Package, color: 'bg-green-500', action: () => setActiveTab('stock') },
    { title: 'View Reports', icon: BarChart3, color: 'bg-purple-500', action: () => setActiveTab('reports') },
    { title: 'Notifications', icon: Bell, color: 'bg-orange-500', action: () => setActiveTab('notifications') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Shop Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your ration shop operations efficiently
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
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Beneficiaries</p>
              <p className="text-3xl font-bold">{stats?.shopBeneficiaries || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+5% this month</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Monthly Distributions</p>
              <p className="text-3xl font-bold">{stats?.monthlyDistributions || 0}</p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-sm">85% of target</span>
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Stock Items</p>
              <p className="text-3xl font-bold">{stats?.currentStock?.length || 0}</p>
              <div className="flex items-center mt-2">
                <Package className="w-4 h-4 mr-1" />
                <span className="text-sm">All items available</span>
              </div>
            </div>
            <Package className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Shop Rating</p>
              <p className="text-3xl font-bold">4.8</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="text-sm">Excellent service</span>
              </div>
            </div>
            <Award className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className={`${action.color} p-3 rounded-lg mb-2`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
              { id: 'stock', label: 'Stock Management', icon: Package },
              { id: 'reports', label: 'Reports', icon: TrendingUp },
              {