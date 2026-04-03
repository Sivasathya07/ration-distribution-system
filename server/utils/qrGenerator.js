const QRCode = require('qrcode');

exports.generateQRCode = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), { width: 200, margin: 2 });
  } catch (err) {
    console.error('QR generation error:', err.message);
    return null;
  }
};

// alias used in some controllers
exports.generateQR = exports.generateQRCode;
