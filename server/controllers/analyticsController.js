const Distribution = require('../models/Distribution');
const Stock = require('../models/Stock');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();

    if (req.user.role === 'admin') {
      const [shops, beneficiaries, shopkeepers, monthDist, complaints, pendingApprovals] = await Promise.all([
        Shop.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'beneficiary', isActive: true }),
        User.countDocuments({ role: 'shopkeeper', isActive: true }),
        Distribution.countDocuments({ month, year }),
        Complaint.countDocuments({ status: 'pending' }),
        User.countDocuments({ role: 'beneficiary', isApproved: false })
      ]);
      return res.json({ success: true, data: { totalShops: shops, totalBeneficiaries: beneficiaries, totalShopkeepers: shopkeepers, monthlyDistributions: monthDist, pendingComplaints: complaints, pendingApprovals } });
    }

    if (req.user.role === 'shopkeeper') {
      const [beneficiaries, monthDist, stock, complaints] = await Promise.all([
        User.countDocuments({ shop: req.user.shop, role: 'beneficiary' }),
        Distribution.countDocuments({ shop: req.user.shop, month, year }),
        Stock.findOne({ shop: req.user.shop, month, year }),
        Complaint.countDocuments({ shop: req.user.shop, status: 'pending' })
      ]);
      return res.json({ success: true, data: { shopBeneficiaries: beneficiaries, monthlyDistributions: monthDist, currentStock: stock?.items || [], pendingComplaints: complaints } });
    }

    if (req.user.role === 'beneficiary') {
      const [total, current] = await Promise.all([
        Distribution.countDocuments({ beneficiary: req.user.id }),
        Distribution.findOne({ beneficiary: req.user.id, month, year })
      ]);
      return res.json({ success: true, data: { totalDistributions: total, currentMonthReceived: !!current, lastDistribution: current } });
    }
  } catch (err) { next(err); }
};

exports.getDistributionTrends = async (req, res, next) => {
  try {
    const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    // Fetch last 12 months across year boundaries
    const trends = await Distribution.aggregate([
      { $group: { _id: { month: '$month', year: '$year' }, count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1 } },
      { $limit: 12 },
      { $project: { _id: { $concat: [{ $substr: ['$_id.month', 0, 3] }, ' ', { $toString: '$_id.year' }] }, count: 1, totalAmount: 1 } }
    ]);
    const sorted = trends.sort((a, b) => {
      const [am, ay] = [a._id.split(' ')[0], parseInt(a._id.split(' ')[1])];
      const [bm, by] = [b._id.split(' ')[0], parseInt(b._id.split(' ')[1])];
      if (ay !== by) return ay - by;
      return monthOrder.findIndex(m => m.startsWith(am)) - monthOrder.findIndex(m => m.startsWith(bm));
    });
    res.json({ success: true, data: sorted });
  } catch (err) { next(err); }
};

exports.getShopPerformance = async (req, res, next) => {
  try {
    const data = await Distribution.aggregate([
      { $group: { _id: '$shop', totalDistributions: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
      { $lookup: { from: 'shops', localField: '_id', foreignField: '_id', as: 'shop' } },
      { $unwind: '$shop' },
      { $project: { shopName: '$shop.name', shopNumber: '$shop.shopNumber', district: '$shop.district', totalDistributions: 1, totalAmount: 1 } },
      { $sort: { totalDistributions: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getFraudAlerts = async (req, res, next) => {
  try {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();
    const duplicates = await Distribution.aggregate([
      { $match: { month, year } },
      { $group: { _id: '$beneficiary', count: { $sum: 1 }, distributions: { $push: '$$ROOT' } } },
      { $match: { count: { $gt: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'beneficiary' } },
      { $unwind: '$beneficiary' }
    ]);
    res.json({ success: true, count: duplicates.length, data: duplicates });
  } catch (err) { next(err); }
};

exports.getDistrictAnalytics = async (req, res, next) => {
  try {
    const data = await Distribution.aggregate([
      { $lookup: { from: 'shops', localField: 'shop', foreignField: '_id', as: 'shopData' } },
      { $unwind: '$shopData' },
      { $group: { _id: '$shopData.district', totalDistributions: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' }, shops: { $addToSet: '$shop' } } },
      { $project: { district: '$_id', totalDistributions: 1, totalAmount: 1, shopCount: { $size: '$shops' } } },
      { $sort: { totalDistributions: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let matchQuery = {};
    if (month) matchQuery.month = month;
    if (year) matchQuery.year = parseInt(year);
    if (req.user.role === 'shopkeeper') matchQuery.shop = req.user.shop;

    const [distributions, stockData] = await Promise.all([
      Distribution.find(matchQuery).populate('beneficiary', 'name rationCardNumber').populate('shop', 'name shopNumber'),
      Stock.find(req.user.role === 'shopkeeper' ? { shop: req.user.shop, month, year } : { month, year }).populate('shop', 'name shopNumber')
    ]);

    const summary = {
      totalDistributions: distributions.length,
      totalAmount: distributions.reduce((s, d) => s + d.totalAmount, 0),
      itemsSummary: {}
    };
    distributions.forEach(d => d.items.forEach(i => {
      if (!summary.itemsSummary[i.name]) summary.itemsSummary[i.name] = 0;
      summary.itemsSummary[i.name] += i.quantity;
    }));

    res.json({ success: true, data: { summary, distributions, stockData } });
  } catch (err) { next(err); }
};
