const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./middleware');
const reviewsController = require('../controllers/reviewsController');

router.get('/book/:bookId', reviewsController.getReviewsByBook);
router.post('/book/:bookId', authMiddleware, reviewsController.addReview);
router.delete('/:id', authMiddleware, reviewsController.deleteReview);

module.exports = router;
