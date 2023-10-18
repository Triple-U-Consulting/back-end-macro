const express = require("express");
const router = express.Router();
const controller = require("../../controller/userController");
const { validateToken } = require("../../jwt/jwt");

router.post("/register", controller.userRegister);
//router.get('/', controller.getAllUser);
router.post("/login", controller.userLogin);
router.get("/profile", validateToken, controller.mockTest);

module.exports = router;
