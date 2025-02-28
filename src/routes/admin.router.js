const express = require('express');
const router = express.Router();
const lineController = require('../controllers/line.controller.js');
const dateController = require('../controllers/datemdl.controller');


router.post('/getLines', lineController.getLinesByDate);

router.post('/setHours', dateController.setHours);

router.post('/cancelLine', lineController.cancelLine);

module.exports = router;