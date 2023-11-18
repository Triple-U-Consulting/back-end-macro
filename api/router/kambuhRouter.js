const express = require("express");
const controller = require("../../controller/kambuhController");
const router = express.Router();

/* GET Method */
router.get("/kambuh", controller.getKambuhData);
router.get("/puff", controller.getPuffData);
router.get("/kambuh/date", controller.getKambuhDataByDate);
router.get("/kambuh/month", controller.getKambuhDataByMonth);
router.get("/kambuh/scale-trigger/null", controller.getKambuhDataIfScaleAndTriggerNull);
router.get("/analytics", controller.getAnalytics);
// router.get("/inhalers", controller.getInhalersData);

/* POST Method */
router.post("/puff", controller.addKambuhData);
router.post("/add/kambuh/data", controller.addManualKambuhData);

/* PUT Method */
router.put("/update/condition", controller.updateCondition);

/* DELETE Method */
router.delete("/delete/data/:kambuh_id", controller.deleteKambuhDataById);

module.exports = router;
