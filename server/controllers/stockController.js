const Stock = require('../models/Stock');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { sendEmail, lowStockAlertEmail } = require('../utils/emailService');

const LOW_STOCK_THRESHOLD = 50;

exports.allocateStock = async (req, res, next) => {
  try {
    const { shopId, items, month, year } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const formattedItems = items.map(item => ({
      ...item,
      allocated: item.quantity || item.allocated,
      remaining: item.quantity || item.allocated,
      distributed: 0
    }));

    let stock = await Stock.findOne({ shop: shopId, month, year });
    if (stock) {
      stock.items = formattedItems;
      stock.allocatedBy = req.user.id;
      stock.updatedAt = new Date(Date.now() + 1000); // ensure it's newer than seeded data
      await stock.save({ validateBeforeSave: false });
    } else {
      stock = await Stock.create({ shop: shopId, items: formattedItems, month, year, allocatedBy: req.user.id, updatedAt: new Date(Date.now() + 1000) });
    }

    // Return populated so frontend can display immediately
    const populated = await Stock.findById(stock._id)
      .populate('shop', 'name shopNumber district')
      .populate('allocatedBy', 'name');
    res.status(201).json({ success: true, data: populated, message: 'Stock allocated successfully' });
  } catch (err) { next(err); }
};

exports.getShopStock = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = { shop: req.params.shopId };
    if (month && year) { query.month = month; query.year = parseInt(year); }
    const stocks = await Stock.find(query).populate('shop', 'name shopNumber').populate('allocatedBy', 'name').sort('-createdAt');
    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (err) { next(err); }
};

exports.getMyStock = async (req, res, next) => {
  try {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();
    const stock = await Stock.findOne({ shop: req.user.shop, month, year });
    res.json({ success: true, data: stock });
  } catch (err) { next(err); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, { items: req.body.items, updatedAt: new Date() }, { new: true });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    const lowItems = stock.items.filter(i => i.remaining < LOW_STOCK_THRESHOLD);
    if (lowItems.length > 0 && !stock.alertSent) {
      const shop = await Shop.findById(stock.shop).populate('owner');
      if (shop?.owner) {
        await sendEmail({ email: shop.owner.email, subject: 'Low Stock Alert', html: lowStockAlertEmail(shop.name, lowItems) });
        await Stock.findByIdAndUpdate(stock._id, { isLowStock: true, alertSent: true });
      }
    }
    res.json({ success: true, data: stock });
  } catch (err) { next(err); }
};

exports.getAllStocks = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month && year) { query.month = month; query.year = parseInt(year); }
    const stocks = await Stock.find(query).populate('shop', 'name shopNumber district state').populate('allocatedBy', 'name').sort('-updatedAt -createdAt');
    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (err) { next(err); }
};

exports.checkLowStock = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'shopkeeper') query.shop = req.user.shop;
    const stocks = await Stock.find(query).populate('shop', 'name shopNumber');
    const lowStockShops = stocks
      .filter(s => s.items.some(i => i.remaining < LOW_STOCK_THRESHOLD))
      .map(s => ({ shop: s.shop, lowItems: s.items.filter(i => i.remaining < LOW_STOCK_THRESHOLD), month: s.month, year: s.year }));
    res.json({ success: true, count: lowStockShops.length, data: lowStockShops });
  } catch (err) { next(err); }
};

exports.getPredictiveDemand = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const Distribution = require('../models/Distribution');
    const past = await Distribution.find({ shop: shopId }).sort('-createdAt').limit(90);
    const itemTotals = {};
    past.forEach(d => d.items.forEach(i => {
      if (!itemTotals[i.name]) itemTotals[i.name] = { total: 0, count: 0 };
      itemTotals[i.name].total += i.quantity;
      itemTotals[i.name].count += 1;
    }));
    const predictions = Object.entries(itemTotals).map(([name, data]) => ({
      name, avgMonthly: Math.ceil((data.total / Math.max(data.count, 1)) * 30), recommended: Math.ceil((data.total / Math.max(data.count, 1)) * 35)
    }));
    res.json({ success: true, data: predictions });
  } catch (err) { next(err); }
};
