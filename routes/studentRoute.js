const router = require('express').Router();
const studentController = require('../controllers/studentController');
const validate = require('../middleware/validate');

router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', validate.validateId, studentController.getStudentById);

module.exports = router;