const Shop = require('../models/Shop');
const User = require('../models/User');
const Rating = require('../models/Rating');

exports.createShop = async (req, res, next) => {
  try {
    const { name, shopNumber, ownerId, address, district, state, pincode, phone, licenseNumber, location, operatingHours } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'shopkeeper')
      return res.status(400).json({ success: false, message: 'Invalid shopkeeper' });

    const shop = await Shop.create({ name, shopNumber, owner: ownerId, address, district, state, pincode, phone, licenseNumber, location, operatingHours });
    await User.findByIdAndUpdate(ownerId, { shop: shop._id, isApproved: true });
    res.status(201).json({ success: true, data: shop });
  } catch (err) { next(err); }
};

exports.getShops = async (req, res, next) => {
  try {
    const { search, district, state } = req.query;
    let query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { shopNumber: { $regex: search, $options: 'i' } }];
    if (district) query.district = district;
    if (state) query.state = state;
    const shops = await Shop.find(query).populate('owner', 'name email phone').sort('-createdAt');
    res.json({ success: true, count: shops.length, data: shops });
  } catch (err) { next(err); }
};

exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (err) { next(err); }
};

exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (err) { next(err); }
};

exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, message: 'Shop deleted' });
  } catch (err) { next(err); }
};

exports.getMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found' });
    res.json({ success: true, data: shop });
  } catch (err) { next(err); }
};

exports.rateShop = async (req, res, next) => {
  try {
    const { rating, feedback, tags } = req.body;
    const shopId = req.params.id;

    const existing = await Rating.findOne({ shop: shopId, ratedBy: req.user.id });
    if (existing) {
      existing.rating = rating; existing.feedback = feedback; existing.tags = tags;
      await existing.save();
    } else {
      await Rating.create({ shop: shopId, ratedBy: req.user.id, rating, feedback, tags });
    }

    const ratings = await Rating.find({ shop: shopId });
    const avg = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
    await Shop.findByIdAndUpdate(shopId, { rating: avg.toFixed(1), totalRatings: ratings.length });

    res.json({ success: true, message: 'Rating submitted' });
  } catch (err) { next(err); }
};

exports.getShopRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ shop: req.params.id }).populate('ratedBy', 'name').sort('-createdAt');
    res.json({ success: true, count: ratings.length, data: ratings });
  } catch (err) { next(err); }
};

exports.getNearbyShops = async (req, res, next) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query;
    const shops = await Shop.find({
      location: { $near: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: parseInt(maxDistance) } },
      isActive: true
    }).populate('owner', 'name phone');
    res.json({ success: true, count: shops.length, data: shops });
  } catch (err) { next(err); }
};
