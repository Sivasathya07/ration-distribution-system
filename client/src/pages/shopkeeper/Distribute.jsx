import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertTriangle, IndianRupee, ShieldCheck, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import jsPDF from 'jspdf';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Payment confirmation modal
const PaymentModal = ({ items, total, beneficiary, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-green-600" /> Payment Confirmation
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Beneficiary</p>
          <p className="font-semibold text-gray-900 dark:text-white">{beneficiary.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{beneficiary.rationCardNumber}</p>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Items to distribute:</p>
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-gray-700 dark:text-gray-300">{item.name} — {item.quantity} {item.unit}</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-5">
          <span className="font-bold text-gray-900 dark:text-white text-lg">Total Payable</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{total.toFixed(2)}</span>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Confirm that the beneficiary has <strong>paid ₹{total.toFixed(2)} in cash</strong> before proceeding. Distribution cannot be reversed.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Processing...' : 'Payment Received — Distribute'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Distribute = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setBeneficiary] = useState(null);
  const [stock, setStock] = useState(null);
  const [items, setItems] = useState([]);
  const [month] = useState(MONTHS[new Date().getMonth()]);
  const [year] = useState(new Date().getFullYear());
  const [dupCheck, setDupCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    api.get('/users/beneficiaries').then(r => setBeneficiaries(r.data.data)).catch(() => {});
    api.get('/stock/my-stock').then(r => {
      setStock(r.data.data);
      if (r.data.data) setItems(r.data.data.items.map(i => ({ ...i, quantity: 0, totalPrice: 0 })));
    }).catch(() => {});
  }, []);

  const selectBeneficiary = async (b) => {
    setBeneficiary(b);
    setSuccess(null);
    try {
      const { data } = await api.get(`/distribution/check/${b._id}/${month}/${year}`);
      setDupCheck(data);
    } catch { setDupCheck(null); }
  };

  const updateQty = (idx, val) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const qty = parseFloat(val) || 0;
      return { ...item, quantity: qty, totalPrice: qty * (item.pricePerUnit || 0) };
    }));
  };

  const distItems = items.filter(i => i.quantity > 0);
  const total = distItems.reduce((s, i) => s + i.totalPrice, 0);

  const handleProceedToPayment = () => {
    if (!selected) return toast.error('Select a beneficiary');
    if (dupCheck?.isDuplicate) return toast.error('Already distributed this month!');
    if (distItems.length === 0) return toast.error('Add at least one item quantity');
    if (total <= 0) return toast.error('Total amount must be greater than ₹0');
    setShowPaymentModal(true);
  };

  const handleConfirmDistribute = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/distribution', {
        beneficiaryId: selected._id,
        items: distItems.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit, pricePerUnit: i.pricePerUnit || 0, totalPrice: i.totalPrice })),
        month, year
      });
      setSuccess(data.data);
      setShowPaymentModal(false);
      toast.success('Distribution recorded successfully!');
      setBeneficiary(null);
      setDupCheck(null);
      setItems(prev => prev.map(i => ({ ...i, quantity: 0, totalPrice: 0 })));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record distribution');
    } finally { setLoading(false); }
  };

  const downloadPDF = (dist) => {
    const pdf = new jsPDF();
    const W = 210;

    // Header background
    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, W, 38, 'F');

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('RATION DISTRIBUTION RECEIPT', W / 2, 14, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Government of India  -  Public Distribution System', W / 2, 24, { align: 'center' });
    pdf.setFontSize(9);
    pdf.text('Digital Ration Distribution Monitoring System', W / 2, 32, { align: 'center' });

    // Receipt info box
    pdf.setTextColor(0, 0, 0);
    pdf.setFillColor(240, 245, 255);
    pdf.rect(14, 44, W - 28, 38, 'F');
    pdf.setDrawColor(180, 200, 240);
    pdf.rect(14, 44, W - 28, 38, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Receipt No:', 20, 53);
    pdf.text('Date:', 20, 61);
    pdf.text('Month/Year:', 20, 69);
    pdf.text('Shop:', 110, 53);
    pdf.text('Ration Card:', 110, 61);

    pdf.setFont('helvetica', 'normal');
    pdf.text(dist.receiptNumber || 'N/A', 55, 53);
    pdf.text(new Date(dist.createdAt).toLocaleDateString('en-IN'), 55, 61);
    pdf.text(`${dist.month} ${dist.year}`, 55, 69);
    pdf.text(dist.shop?.name || 'N/A', 135, 53);
    pdf.text(dist.beneficiary?.rationCardNumber || 'N/A', 135, 61);

    // Beneficiary section
    let y = 92;
    pdf.setFillColor(220, 252, 231);
    pdf.rect(14, y - 6, W - 28, 18, 'F');
    pdf.setDrawColor(134, 239, 172);
    pdf.rect(14, y - 6, W - 28, 18, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 101, 52);
    pdf.text('Beneficiary: ' + (dist.beneficiary?.name || 'N/A'), 20, y + 2);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(21, 128, 61);
    pdf.text('Family Members: ' + (dist.beneficiary?.familyMembers || 1), 20, y + 9);

    // Items table header
    y = 120;
    pdf.setTextColor(0, 0, 0);
    pdf.setFillColor(30, 64, 175);
    pdf.rect(14, y - 6, W - 28, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Item', 20, y);
    pdf.text('Quantity', 80, y);
    pdf.text('Unit', 110, y);
    pdf.text('Rate (Rs)', 130, y);
    pdf.text('Amount (Rs)', 165, y);

    // Items rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    y += 10;

    dist.items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(14, y - 5, W - 28, 10, 'F');
      }
      pdf.setDrawColor(220, 220, 220);
      pdf.rect(14, y - 5, W - 28, 10, 'S');
      pdf.text(item.name, 20, y + 1);
      pdf.text(String(item.quantity), 80, y + 1);
      pdf.text(item.unit, 110, y + 1);
      pdf.text('Rs ' + (item.pricePerUnit || 0), 130, y + 1);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rs ' + (item.totalPrice || 0), 165, y + 1);
      pdf.setFont('helvetica', 'normal');
      y += 10;
    });

    // Total box
    y += 6;
    pdf.setFillColor(30, 64, 175);
    pdf.rect(14, y, W - 28, 14, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('TOTAL AMOUNT PAID (CASH)', 20, y + 9);
    pdf.setFontSize(14);
    pdf.text('Rs ' + dist.totalAmount, W - 20, y + 9, { align: 'right' });

    // Footer
    y += 24;
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text('Payment received in cash at the ration shop counter.', W / 2, y, { align: 'center' });
    pdf.text('This is a computer-generated receipt and does not require a signature.', W / 2, y + 6, { align: 'center' });

    // Border around whole page
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(0.8);
    pdf.rect(5, 5, W - 10, y + 14, 'S');

    pdf.save(`receipt_${dist.receiptNumber}.pdf`);
  };

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.rationCardNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showPaymentModal && (
        <PaymentModal
          items={distItems}
          total={total}
          beneficiary={selected}
          onConfirm={handleConfirmDistribute}
          onCancel={() => setShowPaymentModal(false)}
          loading={loading}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record Distribution</h2>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-green-800 dark:text-green-400">Distribution Successful!</h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">Receipt: <strong>{success.receiptNumber}</strong></p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">Amount collected: <strong>₹{success.totalAmount}</strong></p>
          <button onClick={() => downloadPDF(success)} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700">
            Download Receipt PDF
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiary Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">1. Select Beneficiary</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or ration card..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {filtered.map(b => (
              <div key={b._id} onClick={() => selectBeneficiary(b)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${selected?._id === b._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.rationCardNumber} • {b.familyMembers} members</p>
                  </div>
                  <Badge variant={b.rationCardType === 'BPL' || b.rationCardType === 'AAY' ? 'danger' : 'info'}>{b.rationCardType}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">2. Enter Quantities & Collect Payment</h3>

          {selected && dupCheck?.isDuplicate && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Already distributed to {selected.name} for {month} {year}!
            </div>
          )}

          {selected && !dupCheck?.isDuplicate && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4 text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-300">{selected.name}</p>
              <p className="text-blue-600 dark:text-blue-400">{selected.rationCardNumber} • {month} {year}</p>
            </div>
          )}

          {!selected && (
            <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
              Select a beneficiary from the left panel
            </div>
          )}

          {selected && !dupCheck?.isDuplicate && (
            <>
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-3">
                  <span className="col-span-2">Item</span>
                  <span>Available</span>
                  <span>Qty</span>
                  <span className="text-right">Amount</span>
                </div>
                {items.map((item, idx) => (
                  <div key={item.name} className="grid grid-cols-5 gap-2 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</p>
                      <p className="text-xs text-gray-400">₹{item.pricePerUnit}/{item.unit}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.remaining} {item.unit}</span>
                    <input type="number" min="0" max={item.remaining} value={item.quantity || ''} placeholder="0"
                      onChange={e => updateQty(idx, e.target.value)}
                      className="px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 w-full" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right">₹{item.totalPrice.toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount to Collect</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{total.toFixed(2)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-500 opacity-50" />
              </div>

              <button onClick={handleProceedToPayment} disabled={distItems.length === 0 || total <= 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Proceed to Payment Confirmation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Distribute;
