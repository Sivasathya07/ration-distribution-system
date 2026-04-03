const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  category: {
    type: String,
    enum: ['stock_shortage','quality_issue','overcharging','misbehavior','fraud','other'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['pending','under_review','resolved','rejected'], default: 'pending' },
  priority: { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolution: { type: String },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
