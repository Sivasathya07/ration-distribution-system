const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String },
  tags: [{ type: String, enum: ['good_service','clean','on_time','fair_price','rude','shortage','overcharge'] }],
  createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ shop: 1, ratedBy: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
