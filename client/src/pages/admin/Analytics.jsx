import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [trends, setTrends] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([
      api.get(`/analytics/trends?year=${year}`),
      api.get('/analytics/shop-performance'),
      api.get('/analytics/districts'),
    ]).then(([t, p, d]) => {
      setTrends(t.data.data);
      setPerformance(p.data.data);
      setDistricts(d.data.data);
    }).catch(() => toast.error('Failed to load analytics'));
  }, [year]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <select value={year} onChange={e => setYear(parseInt(e.target.value))}
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Distribution Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Distributions" />
              <Line type="monotone" dataKey="totalAmount" stroke="#10b981" strokeWidth={2} name="Amount (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">District-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="totalDistributions" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Distributions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shop Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performance.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shopName" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalDistributions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Distributions" />
              <Bar dataKey="totalAmount" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
