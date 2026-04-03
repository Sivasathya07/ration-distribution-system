const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  capacity: { type: Number, default: 10 },
  booked: { type: Number, default: 0 },
  bookings: [{
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['booked','completed','cancelled'], default: 'booked' },
    tokenNumber: { type: Number }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slot', slotSchema);
