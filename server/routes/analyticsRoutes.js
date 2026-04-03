const router = require('express').Router();
const { getDashboardStats, getDistributionTrends, getShopPerformance, getFraudAlerts, getDistrictAnalytics, getMonthlyReport } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/trends', authorize('admin', 'shopkeeper'), getDistributionTrends);
router.get('/shop-performance', authorize('admin'), getShopPerformance);
router.get('/fraud', authorize('admin'), getFraudAlerts);
router.get('/districts', authorize('admin'), getDistrictAnalytics);
router.get('/report', getMonthlyReport);

module.exports = router;
