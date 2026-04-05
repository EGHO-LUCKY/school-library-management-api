const router = require('express').Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorizeRole } = require('../middleware/auth');


// registration and login route
router.post('/auth/register', userController.createUser);
router.post('/auth/login', userController.loginUser);


// students route
router.get('/students', authenticate, authorizeRole('admin', 'attendant'), userController.getUsers("student"));
router.get('/students/:id', authenticate, authorizeRole('admin', 'attendant'), validate.validateId, userController.getUserById("student"));


// attendants route
router.get('/attendants', authenticate, authorizeRole('admin'), userController.getUsers("attendant"));
router.get('/attendants/:id', authenticate, authorizeRole('admin'), validate.validateId, userController.getUserById("attendant"));


module.exports = router;