const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const ordersController = require('../controllers/ordersController');

router.get('/', authMiddleware, ordersController.getOrders);
router.get('/all', authMiddleware, adminMiddleware, ordersController.getAllOrders);
router.post('/', authMiddleware, ordersController.placeOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, ordersController.updateOrderStatus);

module.exports = router;
