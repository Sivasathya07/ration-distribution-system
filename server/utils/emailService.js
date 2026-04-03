exports.sendEmail = async (options) => {
  console.log(`[EMAIL SIMULATION] To: ${options.email} | Subject: ${options.subject}`);
  return { success: true, message: 'Email simulated' };
};

exports.distributionReceiptEmail = (name, receipt, items, total) => `
<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px">
  <div style="background:#1e40af;color:white;padding:16px;border-radius:6px;text-align:center">
    <h2 style="margin:0">Ration Distribution Receipt</h2>
    <p style="margin:4px 0;font-size:13px">Government of India - Public Distribution System</p>
  </div>
  <div style="padding:16px">
    <p>Dear <strong>${name}</strong>,</p>
    <p>Your ration has been distributed. Receipt: <strong>${receipt}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin:12px 0">
      <tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Item</th><th>Qty</th><th>Price</th></tr>
      ${items.map(i => `<tr><td style="padding:8px">${i.name}</td><td style="text-align:center">${i.quantity} ${i.unit}</td><td style="text-align:right">₹${i.price || i.totalPrice || 0}</td></tr>`).join('')}
    </table>
    <p style="font-size:16px;font-weight:bold;text-align:right">Total: ₹${total}</p>
  </div>
</div>`;

exports.lowStockAlertEmail = (shopName, items) => `
<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="color:#dc2626">⚠️ Low Stock Alert - ${shopName}</h2>
  <ul>${items.map(i => `<li>${i.name}: <strong>${i.remaining || i.quantity} ${i.unit}</strong> remaining</li>`).join('')}</ul>
  <p>Please request stock replenishment immediately.</p>
</div>`;
