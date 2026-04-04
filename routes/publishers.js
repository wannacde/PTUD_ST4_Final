const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const ctrl = require('../controllers/publishersController');

router.get('/', ctrl.getAllPublishers);
router.get('/:id', ctrl.getPublisherById);
router.post('/', authMiddleware, adminMiddleware, ctrl.createPublisher);
router.put('/:id', authMiddleware, adminMiddleware, ctrl.updatePublisher);
router.delete('/:id', authMiddleware, adminMiddleware, ctrl.deletePublisher);

module.exports = router;
