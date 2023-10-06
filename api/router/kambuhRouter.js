const express = require('express');
const controller = require('../../controller/kambuhController');
const router = express.Router();

router.get('/', controller.getKambuhData);
//router.get('/:kambuhid', controller.getKambuhById);
router.post('/post-data', controller.addKambuhData);
router.get('/puff', controller.getPuffData);

module.exports = router;