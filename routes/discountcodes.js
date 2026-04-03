const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const discountcodesController = require('../controllers/discountcodesController');

router.get('/', authMiddleware, adminMiddleware, discountcodesController.getAllDiscountCodes);
router.post('/', authMiddleware, adminMiddleware, discountcodesController.createDiscountCode);
router.post('/apply', authMiddleware, discountcodesController.applyDiscountCode);
router.delete('/:id', authMiddleware, adminMiddleware, discountcodesController.deleteDiscountCode);

module.exports = router;
