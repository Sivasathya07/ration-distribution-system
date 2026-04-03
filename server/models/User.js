const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'shopkeeper', 'beneficiary'], default: 'beneficiary' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  avatar: { type: String, default: '' },
  rationCardNumber: { type: String, unique: true, sparse: true },
  rationCardType: { type: String, enum: ['APL', 'BPL', 'AAY', 'PHH'], default: 'APL' },
  familyMembers: { type: Number, default: 1 },
  district: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  lastLogin: { type: Date },
  notifications: [{
    message: String,
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
