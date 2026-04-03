import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, Download, Star } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const BeneficiaryDashboard = () => {
  const [stats, setStats] = useState({});
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/dashboard'), api.get('/distribution/my')])
      .then(([s, d]) => { setStats(s.data.data); setDistributions(d.data.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const downloadReceipt = async (id) => {
    try {
      const { data } = await api.get(`/distribution/${id}/receipt`);
      const r = data.data;
      const pdf = new jsPDF();
      pdf.setFillColor(30, 64, 175);
      pdf.rect(0, 0, 210, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text('RATION DISTRIBUTION RECEIPT', 105, 15, { align: 'center' });
      pdf.setFontSize(11);
      pdf.text('Government of India - Public Distribution System', 105, 25, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      let y = 50;
      pdf.setFontSize(11);
      [['Receipt No', r.receiptNumber], ['Date', new Date(r.date).toLocaleDateString()], ['Beneficiary', r.beneficiaryName], ['Ration Card', r.rationCardNumber], ['Shop', r.shopName], ['Month', `${r.month} ${r.year}`]].forEach(([k, v]) => {
        pdf.text(`${k}: ${v}`, 20, y); y += 8;
      });
      y += 5;
      pdf.setFontSize(12); pdf.text('Items:', 20, y); y += 8;
      pdf.setFontSize(10);
      r.items?.forEach(i => { pdf.text(`  • ${i.name}: ${i.quantity} ${i.unit} — ₹${i.totalPrice || 0}`, 20, y); y += 7; });
      y += 5;
      pdf.setFontSize(13);
      pdf.text(`Total: ₹${r.totalAmount}`, 20, y);
      if (r.qrCode) { try { pdf.addImage(r.qrCode, 'PNG', 155, 45, 40, 40); } catch {} }
      pdf.save(`receipt_${r.receiptNumber}.pdf`);
      toast.success('Receipt downloaded!');
    } catch { toast.error('Failed to download receipt'); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Distributions" value={stats.totalDistributions || 0} icon={Package} color="blue" />
        <StatCard title="This Month" value={stats.currentMonthReceived ? 'Received' : 'Pending'} icon={stats.currentMonthReceived ? CheckCircle : Clock} color={stats.currentMonthReceived ? 'green' : 'orange'} />
        <StatCard title="Available Receipts" value={distributions.length} icon={Download} color="purple" />
      </div>

      {/* Current Month Status */}
      <div className={`rounded-2xl p-6 border-2 ${stats.currentMonthReceived ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
        <div className="flex items-center gap-3">
          {stats.currentMonthReceived ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Clock className="w-8 h-8 text-orange-500" />}
          <div>
            <h3 className={`text-lg font-bold ${stats.currentMonthReceived ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}`}>
              {stats.currentMonthReceived ? 'Ration Received This Month' : 'Ration Pending This Month'}
            </h3>
            <p className={`text-sm ${stats.currentMonthReceived ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {stats.currentMonthReceived ? `Distributed on ${new Date(stats.lastDistribution?.createdAt).toLocaleDateString()}` : 'Visit your assigned ration shop to collect your ration'}
            </p>
          </div>
        </div>
      </div>

      {/* Distribution History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Distribution History</h3>
        {distributions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No distributions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {distributions.map(d => (
              <div key={d._id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info">{d.month} {d.year}</Badge>
                      <span className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Shop: {d.shop?.name}</p>
                    <p className="text-xs text-gray-400">Receipt: {d.receiptNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{d.totalAmount}</p>
                    <button onClick={() => downloadReceipt(d._id)} className="mt-2 flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                      <Download className="w-3 h-3" /> Receipt
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {d.items.map((item, i) => (
                    <div key={i} className="text-xs bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                      <p className="text-gray-500 dark:text-gray-400">{item.name}</p>
                      <p className="font-bold text-gray-900 dark:text-white">{item.quantity}{item.unit}</p>
                    </div>
                  ))}
                </div>
                {d.qrCode && <img src={d.qrCode} alt="QR" className="w-16 h-16 mt-3" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
