const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.getAllCategories);
router.post('/', authMiddleware, adminMiddleware, categoriesController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, categoriesController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoriesController.deleteCategory);

module.exports = router;
