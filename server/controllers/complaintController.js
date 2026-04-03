const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res, next) => {
  try {
    const { shop, category, title, description, priority } = req.body;
    const complaint = await Complaint.create({
      submittedBy: req.user.id, shop, category, title, description, priority: priority || 'medium'
    });
    res.status(201).json({ success: true, data: complaint });
  } catch (err) { next(err); }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    let query = {};
    if (req.user.role === 'beneficiary') query.submittedBy = req.user.id;
    if (req.user.role === 'shopkeeper') {
      if (!req.user.shop) return res.json({ success: true, count: 0, data: [] });
      query.shop = req.user.shop;
    }
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email phone')
      .populate('shop', 'name shopNumber')
      .populate('assignedTo', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) { next(err); }
};

exports.getComplaint = async (req, res, next) => {
  try {
    const c = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email phone')
      .populate('shop', 'name shopNumber address')
      .populate('assignedTo', 'name');
    if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: c });
  } catch (err) { next(err); }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const { status, resolution, assignedTo, priority } = req.body;
    const update = { status, priority, updatedAt: new Date() };
    if (assignedTo) update.assignedTo = assignedTo;
    if (resolution) { update.resolution = resolution; update.resolvedAt = new Date(); }

    const c = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('submittedBy', 'name email')
      .populate('shop', 'name');
    if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: c });
  } catch (err) { next(err); }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) { next(err); }
};
