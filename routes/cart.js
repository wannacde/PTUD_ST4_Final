const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./middleware');
const cartController = require('../controllers/cartController');

router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.put('/:id', authMiddleware, cartController.updateCartItem);
router.delete('/:id', authMiddleware, cartController.removeCartItem);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
