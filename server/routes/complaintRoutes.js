const router = require('express').Router();
const { createComplaint, getComplaints, getComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/shop', authorize('shopkeeper'), getComplaints);
router.get('/:id', getComplaint);
router.put('/:id', updateComplaint);
router.put('/:id/respond', authorize('shopkeeper', 'admin'), updateComplaint);
router.delete('/:id', authorize('admin'), deleteComplaint);

module.exports = router;
