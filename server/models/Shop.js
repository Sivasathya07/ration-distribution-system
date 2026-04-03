const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shopNumber: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [80.2707, 13.0827] }
  },
  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '17:00' }
  },
  workingDays: { type: [String], default: ['Mon','Tue','Wed','Thu','Fri','Sat'] },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  beneficiariesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
