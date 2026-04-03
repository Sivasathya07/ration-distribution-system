const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address, rationCardNumber, familyMembers, district, state, pincode, rationCardType } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const isAdmin = role === 'admin';
    const user = await User.create({
      name, email, password,
      role: role || 'beneficiary',
      phone, address,
      rationCardNumber, familyMembers,
      district, state, pincode,
      rationCardType: rationCardType || 'APL',
      isApproved: isAdmin || role === 'shopkeeper' ? true : false
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved }
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, shop: user.shop, isApproved: user.isApproved, avatar: user.avatar }
    });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('shop');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, district, state, pincode, familyMembers } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, district, state, pincode, familyMembers },
      { new: true, runValidators: false }
    ).populate('shop');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
};
