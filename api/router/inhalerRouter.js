const express = require("express");
const controller = require("../../controller/inhalerController");
const router = express.Router();

router.get("/inhaler", controller.getInhalerData);
// router.post("/inhaler-post", controller.addInhalerData);

module.exports = router;
