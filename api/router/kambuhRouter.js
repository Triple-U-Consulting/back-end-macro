const express = require("express");
const controller = require("../../controller/kambuhController");
const router = express.Router();

router.get("/kambuh", controller.getKambuhData);
//router.get('/:kambuhid', controller.getKambuhById);
router.post("/puff", controller.addKambuhData);
router.get("/puff", controller.getPuffData);

module.exports = router;
