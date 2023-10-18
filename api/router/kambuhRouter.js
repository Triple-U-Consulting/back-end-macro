const express = require("express");
const controller = require("../../controller/kambuhController");
const router = express.Router();

router.get("/kambuh", controller.getKambuhData);
//router.get('/:kambuhid', controller.getKambuhById);
router.post("/puff", controller.addKambuhData);
router.get("/puff", controller.getPuffData);
// router.get("/inhalers", controller.getInhalersData);

module.exports = router;
