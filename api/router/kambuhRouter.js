const express = require("express");
const controller = require("../../controller/kambuhController");
const router = express.Router();

router.get("/kambuh", controller.getKambuhData);
//router.get('/:kambuhid', controller.getKambuhById);
router.post("/puff", controller.addKambuhData);
router.get("/puff", controller.getPuffData);
router.put("/update/condition", controller.updateCondition);
router.get("/kambuh/date", controller.getKambuhDataByDate);
router.get("/kambuh/month", controller.getKambuhDataByMonth);
router.get("/kambuh/scale-trigger/null", controller.getKambuhDataIfScaleAndTriggerNull);
// router.get("/inhalers", controller.getInhalersData);

// analytics
router.get("/analytics", controller.getAnalytics);

module.exports = router;
