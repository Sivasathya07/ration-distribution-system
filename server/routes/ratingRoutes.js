const router = require('express').Router();
const { createRating, updateRating, getShopRatings, getMyRating } = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('beneficiary'), createRating);
router.get('/my-rating', authorize('beneficiary'), getMyRating);
router.get('/shop/:shopId', getShopRatings);
router.put('/:id', authorize('beneficiary'), updateRating);

module.exports = router;
