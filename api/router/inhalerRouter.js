const express = require("express");
const controller = require("../../controller/inhalerController");
const router = express.Router();

/* GET Method */
router.get("/inhaler", controller.getInhalerData);

/* POST Method */
router.post("/inhaler", controller.addInhalerData);

/* PUT Method */
router.put("/inhaler/:inhaler_id", controller.updateInhalerData);
router.put("/inhaler/update/remaining-inhaler/:inhaler_id", controller.updateBottleInhaler);

module.exports = router;
