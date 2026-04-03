const router = require('express').Router();
const { createSlots, getSlots, getMySlots, getAvailableSlots, getMyBooking, bookSlot, cancelBooking, getMyBookings, updateSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('shopkeeper'), createSlots);
router.get('/', getSlots);
router.get('/my-slots', authorize('shopkeeper'), getMySlots);
router.get('/available', authorize('beneficiary'), getAvailableSlots);
router.get('/my-booking', authorize('beneficiary'), getMyBooking);
router.get('/my-bookings', authorize('beneficiary'), getMyBookings);
router.post('/:id/book', authorize('beneficiary'), bookSlot);
router.delete('/:id/cancel', authorize('beneficiary'), cancelBooking);
router.put('/:id', authorize('shopkeeper'), updateSlot);

module.exports = router;
