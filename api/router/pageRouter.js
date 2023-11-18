const express = require("express");
const router = express.Router();
const controller = require("../../controller/pageController");
const { validateToken } = require("../../jwt/jwt");

/* GET Method */
router.get("/home", validateToken, controller.getHomeData)

module.exports = router;