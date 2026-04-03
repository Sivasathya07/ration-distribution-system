const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{
    name: { type: String, required: true, enum: ['Rice','Wheat','Sugar','Kerosene','Cooking Oil','Dal','Salt'] },
    allocated: { type: Number, default: 0 },
    distributed: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, default: 0 }
  }],
  month: { type: String, required: true },
  year: { type: Number, required: true },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLowStock: { type: Boolean, default: false },
  alertSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

stockSchema.index({ shop: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
