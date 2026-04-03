const router = require('express').Router();
const { allocateStock, getShopStock, getMyStock, updateStock, getAllStocks, checkLowStock, getPredictiveDemand } = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/allocate', authorize('admin'), allocateStock);
router.get('/all', authorize('admin'), getAllStocks);
router.get('/low-stock', checkLowStock);
router.get('/my-stock', authorize('shopkeeper'), getMyStock);
router.get('/shop/:shopId', getShopStock);
router.get('/predict/:shopId', authorize('admin', 'shopkeeper'), getPredictiveDemand);
router.put('/:id', authorize('admin', 'shopkeeper'), updateStock);

module.exports = router;
