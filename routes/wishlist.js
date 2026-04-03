const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./middleware');
const wishlistController = require('../controllers/wishlistController');

router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/', authMiddleware, wishlistController.addToWishlist);
router.delete('/:id', authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
