const router = require('express').Router();
const authorController = require('../controllers/authorController');
const validate = require('../middleware/validate');

router.post('/', authorController.createAuthor);
router.get('/', authorController.getAuthors);
router.get('/:id', validate.validateId, authorController.getAuthorById);
router.put('/:id', validate.validateId, authorController.updateAuthorById);
router.delete('/:id', validate.validateId, authorController.deleteAuthorById);

module.exports = router;