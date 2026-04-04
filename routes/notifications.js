const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('./middleware');
const ctrl = require('../controllers/notificationsController');

router.get('/', authMiddleware, ctrl.getMyNotifications);
router.put('/read-all', authMiddleware, ctrl.markAllAsRead);
router.put('/:id/read', authMiddleware, ctrl.markAsRead);
router.delete('/:id', authMiddleware, ctrl.deleteNotification);
router.post('/send', authMiddleware, adminMiddleware, ctrl.sendNotification);

module.exports = router;
