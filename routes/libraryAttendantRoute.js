const router = require('express').Router();
const attendantController = require('../controllers/libraryAttendantController');

router.post('/', attendantController.createAttendant);
router.get('/', attendantController.getAttendants);

module.exports = router;