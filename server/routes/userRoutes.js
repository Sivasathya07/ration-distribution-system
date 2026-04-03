const router = require('express').Router();
const { getUsers, getUser, updateUser, deleteUser, approveUser, getBeneficiaries, getMyShop, assignShop, getNotifications, markNotificationRead } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.get('/beneficiaries', authorize('admin', 'shopkeeper'), getBeneficiaries);
router.get('/my-shop', authorize('beneficiary'), getMyShop);
router.get('/notifications', getNotifications);
router.put('/notifications/:notifId/read', markNotificationRead);
router.get('/:id', getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/approve', authorize('admin'), approveUser);
router.put('/:id/assign-shop', authorize('admin'), assignShop);

module.exports = router;
