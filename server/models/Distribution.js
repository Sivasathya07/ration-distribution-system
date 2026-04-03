const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  distributedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    quantity: Number,
    unit: String,
    pricePerUnit: Number,
    totalPrice: Number
  }],
  totalAmount: { type: Number, default: 0 },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  receiptNumber: { type: String, unique: true },
  qrCode: { type: String },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
  status: { type: String, enum: ['completed','cancelled','pending'], default: 'completed' },
  isFraudulent: { type: Boolean, default: false },
  fraudReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

distributionSchema.index({ beneficiary: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Distribution', distributionSchema);
