import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/shops': 'Shop Management',
  '/admin/stock': 'Stock Allocation',
  '/admin/distributions': 'Distributions',
  '/admin/complaints': 'Complaints',
  '/admin/analytics': 'Analytics',
  '/admin/fraud': 'Fraud Detection',
  '/admin/profile': 'Profile',
  '/shop': 'Shopkeeper Dashboard',
  '/shop/distribute': 'Record Distribution',
  '/shop/stock': 'Stock Management',
  '/shop/beneficiaries': 'Beneficiaries',
  '/shop/slots': 'Slot Management',
  '/shop/complaints': 'Complaints',
  '/shop/profile': 'Profile',
  '/beneficiary': 'My Dashboard',
  '/beneficiary/history': 'Distribution History',
  '/beneficiary/slots': 'Book Slot',
  '/beneficiary/shops': 'Shop Locator',
  '/beneficiary/complaints': 'My Complaints',
  '/beneficiary/ratings': 'Rate Shop',
  '/beneficiary/profile': 'Profile',
};

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setCollapsed(p => !p)} title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
