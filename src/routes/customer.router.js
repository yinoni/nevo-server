const express = require('express');
const router = express.Router();
const lineController = require('../controllers/line.controller.js');
const dateController = require('../controllers/datemdl.controller');


router.get('/', (req, res) => {
    res.send('Hello from customer.routes.js');
});

router.post('/addLine', lineController.addNewLine);

router.post('/getHours', dateController.getHours);

router.post('/cancelLine', lineController.cancelLine);



module.exports = router;
