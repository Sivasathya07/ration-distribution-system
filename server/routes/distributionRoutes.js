const router = require('express').Router();
const { createDistribution, getDistributions, getDistribution, getMyDistributions, downloadReceipt, checkDuplicate } = require('../controllers/distributionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('shopkeeper'), createDistribution);
router.get('/', authorize('admin', 'shopkeeper'), getDistributions);
router.get('/my', authorize('beneficiary'), getMyDistributions);
router.get('/my-history', authorize('beneficiary'), getMyDistributions);
router.get('/check/:beneficiaryId/:month/:year', authorize('shopkeeper'), checkDuplicate);
router.get('/:id', getDistribution);
router.get('/:id/receipt', downloadReceipt);

module.exports = router;
