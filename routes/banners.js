const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const ctrl = require('../controllers/bannersController');

router.get('/', ctrl.getActiveBanners);
router.get('/all', authMiddleware, adminMiddleware, ctrl.getAllBanners);
router.post('/', authMiddleware, adminMiddleware, ctrl.createBanner);
router.put('/:id', authMiddleware, adminMiddleware, ctrl.updateBanner);
router.delete('/:id', authMiddleware, adminMiddleware, ctrl.deleteBanner);

module.exports = router;
