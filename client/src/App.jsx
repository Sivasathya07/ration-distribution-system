import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminShops from './pages/admin/Shops';
import AdminStockAllocation from './pages/admin/StockAllocation';
import AdminComplaints from './pages/admin/Complaints';
import AdminAnalytics from './pages/admin/Analytics';
import AdminFraudDetection from './pages/admin/FraudDetection';
import AdminProfile from './pages/admin/Profile';

// Shopkeeper pages
import ShopDashboard from './pages/shopkeeper/Dashboard';
import ShopDistribute from './pages/shopkeeper/Distribute';
import ShopStock from './pages/shopkeeper/Stock';
import ShopBeneficiaries from './pages/shopkeeper/Beneficiaries';
import ShopSlots from './pages/shopkeeper/Slots';
import ShopComplaints from './pages/shopkeeper/Complaints';
import ShopProfile from './pages/shopkeeper/Profile';

// Beneficiary pages
import BeneficiaryDashboard from './pages/beneficiary/Dashboard';
import BeneficiaryHistory from './pages/beneficiary/History';
import BeneficiarySlots from './pages/beneficiary/Slots';
import BeneficiaryShops from './pages/beneficiary/Shops';
import BeneficiaryComplaints from './pages/beneficiary/Complaints';
import BeneficiaryRatings from './pages/beneficiary/Ratings';
import BeneficiaryProfile from './pages/beneficiary/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><Layout /></PrivateRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="shops" element={<AdminShops />} />
              <Route path="stock" element={<AdminStockAllocation />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="fraud" element={<AdminFraudDetection />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Shopkeeper Routes */}
            <Route path="/shop" element={<PrivateRoute allowedRoles={['shopkeeper']}><Layout /></PrivateRoute>}>
              <Route index element={<ShopDashboard />} />
              <Route path="distribute" element={<ShopDistribute />} />
              <Route path="stock" element={<ShopStock />} />
              <Route path="beneficiaries" element={<ShopBeneficiaries />} />
              <Route path="slots" element={<ShopSlots />} />
              <Route path="complaints" element={<ShopComplaints />} />
              <Route path="profile" element={<ShopProfile />} />
            </Route>

            {/* Beneficiary Routes */}
            <Route path="/beneficiary" element={<PrivateRoute allowedRoles={['beneficiary']}><Layout /></PrivateRoute>}>
              <Route index element={<BeneficiaryDashboard />} />
              <Route path="history" element={<BeneficiaryHistory />} />
              <Route path="slots" element={<BeneficiarySlots />} />
              <Route path="shops" element={<BeneficiaryShops />} />
              <Route path="complaints" element={<BeneficiaryComplaints />} />
              <Route path="ratings" element={<BeneficiaryRatings />} />
              <Route path="profile" element={<BeneficiaryProfile />} />
            </Route>

            {/* Redirect /dashboard to role-based route */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'shopkeeper') return <Navigate to="/shop" replace />;
  return <Navigate to="/beneficiary" replace />;
};

export default App;
