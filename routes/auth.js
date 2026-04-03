const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('./middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/register',
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  authController.register
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  authController.login
);

// Get current user profile
router.get('/me', authMiddleware, authController.getMe);

// Update current user profile (with avatar)
router.put('/me', authMiddleware, upload.single('avatar'), authController.updateMe);

// Admin: get all users
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);

// Admin: update user role
router.put('/users/:id/role', authMiddleware, adminMiddleware, authController.updateUserRole);

// Admin: delete user
router.delete('/users/:id', authMiddleware, adminMiddleware, authController.deleteUser);

module.exports = router;
