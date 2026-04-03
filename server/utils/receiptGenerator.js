exports.generateReceiptNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${ts}-${rand}`;
};

exports.generateReceiptData = (distribution, beneficiary, shop) => ({
  receiptNumber: distribution.receiptNumber,
  beneficiaryName: beneficiary.name,
  rationCardNumber: beneficiary.rationCardNumber,
  phone: beneficiary.phone,
  address: beneficiary.address,
  shopName: shop.name,
  shopNumber: shop.shopNumber,
  shopAddress: shop.address,
  items: distribution.items,
  totalAmount: distribution.totalAmount,
  month: distribution.month,
  year: distribution.year,
  date: distribution.createdAt,
  qrCode: distribution.qrCode
});
