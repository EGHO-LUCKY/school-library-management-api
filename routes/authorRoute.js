const router = require('express').Router();
const authorController = require('../controllers/authorController');
const validate = require('../middleware/validate');
const { authenticate, authorizeRole } = require('../middleware/auth');


router.post('/authors', authenticate, authorizeRole('admin'), authorController.createAuthor);
router.get('/authors', authenticate, authorizeRole('admin'), authorController.getAuthors);
router.get('/authors/:id', authenticate, authorizeRole('admin'), validate.validateId, authorController.getAuthorById);
router.put('/authors/:id', authenticate, authorizeRole('admin'), validate.validateId, authorController.updateAuthorById);
router.delete('/authors/:id', authenticate, authorizeRole('admin'), validate.validateId, authorController.deleteAuthorById);

module.exports = router;