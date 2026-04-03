const Slot = require('../models/Slot');

exports.createSlots = async (req, res, next) => {
  try {
    const { date, startTime, endTime, maxBeneficiaries } = req.body;
    const shopId = req.user.shop;
    if (!shopId) return res.status(400).json({ success: false, message: 'No shop assigned to your account' });
    const timeSlot = `${startTime}-${endTime}`;
    const slot = await Slot.create({
      shop: shopId,
      date: new Date(date),
      timeSlot,
      capacity: maxBeneficiaries || 10
    });
    res.status(201).json({ success: true, data: slot });
  } catch (err) { next(err); }
};

exports.getSlots = async (req, res, next) => {
  try {
    const { shopId, date } = req.query;
    let query = {};
    if (shopId) query.shop = shopId;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }
    const slots = await Slot.find(query).populate('shop', 'name shopNumber').sort('date timeSlot');
    res.json({ success: true, data: slots });
  } catch (err) { next(err); }
};

exports.getMySlots = async (req, res, next) => {
  try {
    const shopId = req.user.shop;
    const slots = await Slot.find({ shop: shopId }).sort('-date').populate('shop', 'name');
    const formatted = slots.map(s => {
      const [startTime, endTime] = s.timeSlot.split('-');
      return {
        ...s.toObject(),
        startTime,
        endTime,
        maxBeneficiaries: s.capacity,
        bookedCount: s.booked,
        status: s.booked >= s.capacity ? 'full' : s.isActive ? 'open' : 'closed'
      };
    });
    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slots = await Slot.find({ date: { $gte: today }, isActive: true })
      .populate('shop', 'name address')
      .sort('date timeSlot');
    const formatted = slots.map(s => {
      const [startTime, endTime] = s.timeSlot.split('-');
      return {
        ...s.toObject(),
        startTime,
        endTime,
        maxBeneficiaries: s.capacity,
        bookedCount: s.booked
      };
    });
    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
};

exports.getMyBooking = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slot = await Slot.findOne({
      date: { $gte: today },
      'bookings.beneficiary': req.user.id,
      'bookings.status': 'booked'
    }).populate('shop', 'name address');
    if (!slot) return res.json({ success: true, data: null });
    const [startTime, endTime] = slot.timeSlot.split('-');
    res.json({ success: true, data: { ...slot.toObject(), startTime, endTime } });
  } catch (err) { next(err); }
};

exports.bookSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    if (!slot.isActive) return res.status(400).json({ success: false, message: 'Slot is closed' });
    if (slot.booked >= slot.capacity) return res.status(400).json({ success: false, message: 'Slot is full' });

    const alreadyBooked = slot.bookings.find(b => b.beneficiary.toString() === req.user.id.toString() && b.status === 'booked');
    if (alreadyBooked) return res.status(400).json({ success: false, message: 'Already booked this slot' });

    const tokenNumber = slot.booked + 1;
    slot.bookings.push({ beneficiary: req.user.id, tokenNumber });
    slot.booked += 1;
    await slot.save();

    res.json({ success: true, data: { slot, tokenNumber }, message: `Slot booked! Token #${tokenNumber}` });
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    const idx = slot.bookings.findIndex(b => b.beneficiary.toString() === req.user.id.toString() && b.status === 'booked');
    if (idx === -1) return res.status(400).json({ success: false, message: 'No booking found' });
    slot.bookings[idx].status = 'cancelled';
    slot.booked = Math.max(0, slot.booked - 1);
    await slot.save();
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const slots = await Slot.find({ 'bookings.beneficiary': req.user.id }).populate('shop', 'name shopNumber address');
    const myBookings = slots.map(s => ({
      ...s.toObject(),
      myBooking: s.bookings.find(b => b.beneficiary.toString() === req.user.id.toString())
    }));
    res.json({ success: true, data: myBookings });
  } catch (err) { next(err); }
};

exports.updateSlot = async (req, res, next) => {
  try {
    const { status } = req.body;
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    if (status === 'closed') slot.isActive = false;
    if (status === 'open') slot.isActive = true;
    await slot.save();
    res.json({ success: true, data: slot });
  } catch (err) { next(err); }
};
