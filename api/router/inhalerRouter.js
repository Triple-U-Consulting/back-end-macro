const express = require("express");
const controller = require("../../controller/inhalerController");
const router = express.Router();

router.get("/inhaler", controller.getInhalerData);
router.post("/inhaler", controller.addInhalerData);
router.put("/inhaler/:inhaler_id", controller.updateInhalerData);

module.exports = router;
