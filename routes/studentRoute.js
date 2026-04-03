const router = require('express').Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorizeRole } = require('../middleware/auth');

// students route
router.get('/students', authenticate, authorizeRole('admin', 'attendant'), userController.getUsers("student"));
router.get('/students/:id', authenticate, authorizeRole('admin', 'attendant'), validate.validateId, userController.getUserById("student"));

module.exports = router;