const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./middleware');
const ctrl = require('../controllers/addressController');

router.get('/', authMiddleware, ctrl.getMyAddresses);
router.post('/', authMiddleware, ctrl.createAddress);
router.put('/:id', authMiddleware, ctrl.updateAddress);
router.delete('/:id', authMiddleware, ctrl.deleteAddress);

module.exports = router;
