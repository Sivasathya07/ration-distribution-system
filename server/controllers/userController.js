const User = require('../models/User');
const Shop = require('../models/Shop');

exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, isApproved } = req.query;
    let query = {};
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rationCardNumber: { $regex: search, $options: 'i' } }
    ];
    const users = await User.find(query).populate('shop', 'name shopNumber').sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('shop');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user.id, approvedAt: new Date() },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user, message: 'User approved' });
  } catch (err) { next(err); }
};

exports.getBeneficiaries = async (req, res, next) => {
  try {
    let query = { role: 'beneficiary' };
    if (req.user.role === 'shopkeeper') query.shop = req.user.shop;
    const { search } = req.query;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { rationCardNumber: { $regex: search, $options: 'i' } }
    ];
    const users = await User.find(query).populate('shop', 'name shopNumber').sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

exports.assignShop = async (req, res, next) => {
  try {
    const { shopId } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Decrement old shop count
    if (user.shop && user.shop.toString() !== shopId) {
      await Shop.findByIdAndUpdate(user.shop, { $inc: { beneficiariesCount: -1 } });
    }

    user.shop = shopId;
    user.isApproved = true;
    await user.save();

    // Increment new shop count only if newly assigned
    if (!user.shop || user.shop.toString() !== shopId) {
      await Shop.findByIdAndUpdate(shopId, { $inc: { beneficiariesCount: 1 } });
    }

    const updated = await User.findById(req.params.id).populate('shop');
    res.json({ success: true, data: updated, message: 'Shop assigned successfully' });
  } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    res.json({ success: true, data: user.notifications.sort((a, b) => b.createdAt - a.createdAt) });
  } catch (err) { next(err); }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id, 'notifications._id': req.params.notifId },
      { $set: { 'notifications.$.isRead': true } }
    );
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) { next(err); }
};

exports.getMyShop = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('shop');
    if (!user?.shop) return res.json({ success: true, data: null });
    res.json({ success: true, data: user.shop });
  } catch (err) { next(err); }
};
