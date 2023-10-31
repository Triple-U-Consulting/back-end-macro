const express = require("express");
const controller = require("../../controller/inhalerController");
const router = express.Router();

router.get("/inhaler", controller.getInhalerData);
router.post("/inhaler", controller.addInhalerData);
router.put("/inhaler/:inhaler_id", controller.updateInhalerData);
router.put("/inhaer/update/remaining-inhaler/:inhaler_id", controller.updateBottleInhaler);

module.exports = router;
