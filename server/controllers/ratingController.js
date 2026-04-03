const Rating = require('../models/Rating');
const Shop = require('../models/Shop');

exports.createRating = async (req, res, next) => {
  try {
    const { shop, rating, comment } = req.body;
    const existing = await Rating.findOne({ shop, ratedBy: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already rated this shop. Use update instead.' });
    const r = await Rating.create({ shop, ratedBy: req.user.id, rating, feedback: comment });
    // Update shop average rating
    const ratings = await Rating.find({ shop });
    const avg = ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;
    await Shop.findByIdAndUpdate(shop, { rating: Math.round(avg * 10) / 10 });
    res.status(201).json({ success: true, data: r });
  } catch (err) { next(err); }
};

exports.updateRating = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const r = await Rating.findByIdAndUpdate(req.params.id, { rating, feedback: comment }, { new: true });
    if (!r) return res.status(404).json({ success: false, message: 'Rating not found' });
    const ratings = await Rating.find({ shop: r.shop });
    const avg = ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;
    await Shop.findByIdAndUpdate(r.shop, { rating: Math.round(avg * 10) / 10 });
    res.json({ success: true, data: r });
  } catch (err) { next(err); }
};

exports.getShopRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ shop: req.params.shopId })
      .populate('ratedBy', 'name')
      .sort('-createdAt');
    const formatted = ratings.map(r => ({ ...r.toObject(), beneficiary: r.ratedBy, comment: r.feedback }));
    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
};

exports.getMyRating = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user.id).populate('shop');
    if (!user?.shop) return res.json({ success: true, data: null });
    const r = await Rating.findOne({ shop: user.shop._id, ratedBy: req.user.id });
    if (!r) return res.json({ success: true, data: null });
    res.json({ success: true, data: { ...r.toObject(), comment: r.feedback } });
  } catch (err) { next(err); }
};
