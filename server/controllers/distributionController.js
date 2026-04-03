const Distribution = require('../models/Distribution');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { generateReceiptNumber, generateReceiptData } = require('../utils/receiptGenerator');
const { generateQRCode } = require('../utils/qrGenerator');
const { sendEmail, distributionReceiptEmail } = require('../utils/emailService');

exports.createDistribution = async (req, res, next) => {
  try {
    const { beneficiaryId, items, month, year, slotId } = req.body;

    const beneficiary = await User.findById(beneficiaryId);
    if (!beneficiary || beneficiary.role !== 'beneficiary')
      return res.status(404).json({ success: false, message: 'Beneficiary not found' });

    const duplicate = await Distribution.findOne({ beneficiary: beneficiaryId, month, year });
    if (duplicate)
      return res.status(400).json({ success: false, message: 'Ration already distributed this month', isFraud: true });

    const shopId = req.user.shop;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const stock = await Stock.findOne({ shop: shopId, month, year });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not allocated for this month' });

    for (const item of items) {
      const si = stock.items.find(s => s.name === item.name);
      if (!si || si.remaining < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
      si.remaining -= item.quantity;
      si.distributed = (si.distributed || 0) + item.quantity;
    }
    stock.updatedAt = new Date();
    await stock.save();

    const totalAmount = items.reduce((s, i) => s + (i.totalPrice || i.price || 0), 0);
    const receiptNumber = generateReceiptNumber();

    const distribution = await Distribution.create({
      beneficiary: beneficiaryId, shop: shopId, distributedBy: req.user.id,
      items, totalAmount, month, year, receiptNumber, slotId: slotId || undefined
    });

    const qrCode = await generateQRCode({ receiptNumber, beneficiary: beneficiary.name, rationCard: beneficiary.rationCardNumber, shop: shop.name, date: distribution.createdAt });
    distribution.qrCode = qrCode;
    await distribution.save();

    await sendEmail({ email: beneficiary.email, subject: 'Ration Distribution Receipt', html: distributionReceiptEmail(beneficiary.name, receiptNumber, items, totalAmount) });

    const populated = await Distribution.findById(distribution._id)
      .populate('beneficiary', 'name rationCardNumber phone')
      .populate('shop', 'name shopNumber');

    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.getDistributions = async (req, res, next) => {
  try {
    const { month, year, shopId, page = 1, limit = 20 } = req.query;
    let query = {};
    if (req.user.role === 'shopkeeper') query.shop = req.user.shop;
    if (month && year) { query.month = month; query.year = parseInt(year); }
    if (shopId && req.user.role === 'admin') query.shop = shopId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [distributions, total] = await Promise.all([
      Distribution.find(query).populate('beneficiary', 'name rationCardNumber phone').populate('shop', 'name shopNumber').populate('distributedBy', 'name').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Distribution.countDocuments(query)
    ]);
    res.json({ success: true, count: distributions.length, total, pages: Math.ceil(total / limit), data: distributions });
  } catch (err) { next(err); }
};

exports.getDistribution = async (req, res, next) => {
  try {
    const d = await Distribution.findById(req.params.id)
      .populate('beneficiary', 'name rationCardNumber phone address')
      .populate('shop', 'name shopNumber address phone')
      .populate('distributedBy', 'name');
    if (!d) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: d });
  } catch (err) { next(err); }
};

exports.getMyDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find({ beneficiary: req.user.id })
      .populate('shop', 'name shopNumber address').sort('-createdAt');
    res.json({ success: true, count: distributions.length, data: distributions });
  } catch (err) { next(err); }
};

exports.downloadReceipt = async (req, res, next) => {
  try {
    const d = await Distribution.findById(req.params.id)
      .populate('beneficiary', 'name rationCardNumber phone address')
      .populate('shop', 'name shopNumber address');
    if (!d) return res.status(404).json({ success: false, message: 'Not found' });
    const { generateReceiptData } = require('../utils/receiptGenerator');
    res.json({ success: true, data: generateReceiptData(d, d.beneficiary, d.shop) });
  } catch (err) { next(err); }
};

exports.checkDuplicate = async (req, res, next) => {
  try {
    const { beneficiaryId, month, year } = req.params;
    const existing = await Distribution.findOne({ beneficiary: beneficiaryId, month, year });
    res.json({ success: true, isDuplicate: !!existing, distribution: existing });
  } catch (err) { next(err); }
};
