const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, adminMiddleware } = require('./middleware');
const booksController = require('../controllers/booksController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', authMiddleware, adminMiddleware, upload.single('image'),
  body('title').notEmpty(),
  body('author').notEmpty(),
  body('price').isNumeric(),
  booksController.createBook
);
router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), booksController.updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, booksController.deleteBook);

module.exports = router;
