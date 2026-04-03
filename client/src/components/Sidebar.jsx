import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Store, Package, BarChart3, FileText,
  AlertTriangle, LogOut, ChevronLeft, ChevronRight, Bell,
  ClipboardList, MapPin, Calendar, Star, ShieldAlert, Settings
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/shops', label: 'Shops', icon: Store },
  { to: '/admin/stock', label: 'Stock Allocation', icon: Package },
  { to: '/admin/distributions', label: 'Distributions', icon: ClipboardList },
  { to: '/admin/complaints', label: 'Complaints', icon: AlertTriangle },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/fraud', label: 'Fraud Detection', icon: ShieldAlert },
];

const shopkeeperLinks = [
  { to: '/shop', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/shop/distribute', label: 'Distribute', icon: Package },
  { to: '/shop/stock', label: 'Stock', icon: BarChart3 },
  { to: '/shop/beneficiaries', label: 'Beneficiaries', icon: Users },
  { to: '/shop/slots', label: 'Slot Management', icon: Calendar },
  { to: '/shop/complaints', label: 'Complaints', icon: AlertTriangle },
];

const beneficiaryLinks = [
  { to: '/beneficiary', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/beneficiary/history', label: 'My Rations', icon: ClipboardList },
  { to: '/beneficiary/slots', label: 'Book Slot', icon: Calendar },
  { to: '/beneficiary/shops', label: 'Shop Locator', icon: MapPin },
  { to: '/beneficiary/complaints', label: 'Complaints', icon: AlertTriangle },
  { to: '/beneficiary/ratings', label: 'Rate Shop', icon: Star },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'shopkeeper' ? shopkeeperLinks : beneficiaryLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-gray-900 dark:bg-gray-950 flex flex-col h-screen sticky top-0 z-30`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 via-white to-green-500 flex-shrink-0" />
            <div>
              <p className="text-white font-bold text-xs leading-tight">Digital Ration</p>
              <p className="text-gray-400 text-xs">Distribution System</p>
            </div>
          </div>
        )}
        {collapsed && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 via-white to-green-500 mx-auto" />}
        <button onClick={() => setCollapsed(p => !p)} className="text-gray-400 hover:text-white p-1 rounded ml-auto">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-gray-700 space-y-1">
        <NavLink to={`/${user?.role === 'admin' ? 'admin' : user?.role === 'shopkeeper' ? 'shop' : 'beneficiary'}/profile`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Profile</span>}
        </NavLink>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
