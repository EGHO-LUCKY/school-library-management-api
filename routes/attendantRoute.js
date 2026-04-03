const router = require('express').Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorizeRole } = require('../middleware/auth');


// attendants route
router.get('/attendants', authenticate, authorizeRole('admin'), userController.getUsers("attendant"));
router.get('/attendants/:id', authenticate, authorizeRole('admin'), validate.validateId, userController.getUserById("attendant"));

module.exports = router;