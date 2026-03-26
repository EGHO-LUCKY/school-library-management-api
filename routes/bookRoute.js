const router = require('express').Router();
const bookController = require('../controllers/bookController');
const validate = require('../middleware/validate');

router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', validate.validateId, bookController.getBookById);
router.put('/:id', validate.validateId, bookController.updateBookById);
router.delete('/:id', validate.validateId, bookController.deleteBookById);
router.post('/:id/borrow', validate.validateId, validate.validateDate, bookController.borrowBook);
router.post('/:id/return', validate.validateId, bookController.returnBook);

module.exports = router;