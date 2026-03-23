const router = require('express').Router();
const authorController = require('../controller/authorController');

router.post('/authors', authorController.createAuthor);
router.get('/authors', authorController.getAuthors);
router.get('/authors/:id', authorController.getAuthorById);
router.put('/authors/:id', authorController.updateAuthorById);
router.delete('/authors/:id', authorController.deleteAuthorById);

module.exports = router;