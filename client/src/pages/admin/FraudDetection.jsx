import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/ui/Badge';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/fraud').then(r => setAlerts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-7 h-7 text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fraud Detection</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Duplicate distribution monitoring</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : alerts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Fraud Detected</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">All distributions this month appear legitimate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400 font-medium">{alerts.length} suspicious case(s) detected this month</p>
          </div>
          {alerts.map((a, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{a.beneficiary?.name}</h3>
                  <p className="text-sm text-gray-500">Ration Card: {a.beneficiary?.rationCardNumber || 'N/A'}</p>
                </div>
                <Badge variant="danger">{a.count} distributions</Badge>
              </div>
              <div className="space-y-2">
                {a.distributions?.map((d, j) => (
                  <div key={j} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Receipt: {d.receiptNumber} — {new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudDetection;
