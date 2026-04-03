const router = require('express').Router();
const { createShop, getShops, getShop, updateShop, deleteShop, getMyShop, rateShop, getShopRatings, getNearbyShops } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('admin'), createShop);
router.get('/', getShops);
router.get('/my-shop', authorize('shopkeeper'), getMyShop);
router.get('/nearby', getNearbyShops);
router.get('/:id', getShop);
router.put('/:id', authorize('admin'), updateShop);
router.delete('/:id', authorize('admin'), deleteShop);
router.post('/:id/rate', authorize('beneficiary'), rateShop);
router.get('/:id/ratings', getShopRatings);

module.exports = router;
