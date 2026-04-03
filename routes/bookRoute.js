const router = require('express').Router();
const bookController = require('../controllers/bookController');
const validate = require('../middleware/validate');
const { authenticate, authorizeRole } = require('../middleware/auth');


router.post('/books', authenticate, authorizeRole('admin'), bookController.createBook);
router.get('/books', authenticate, bookController.getBooks);
router.get('/books/:id',authenticate, validate.validateId, bookController.getBookById);
router.put('/books/:id', authenticate, authorizeRole('admin'), validate.validateId, bookController.updateBookById);
router.delete('/books/:id', authenticate, authorizeRole('admin'), validate.validateId, bookController.deleteBookById);
router.post('/books/:id/borrow', authenticate, authorizeRole('attendant'), validate.validateId, validate.validateDate, bookController.borrowBook);
router.post('/books/:id/return', authenticate, authorizeRole('attendant'), validate.validateId, bookController.returnBook);

module.exports = router;