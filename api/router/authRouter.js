const express = require("express");
const router = express.Router();
const controller = require("../../controller/userController");
const { validateToken } = require("../../jwt/jwt");

/* GET Method */
router.get('/', controller.getAllUserData);
router.get("/profile", validateToken, controller.getAllUserData);

/* POST Method */
router.post("/register", controller.userRegister);
router.post("/login", controller.userLogin);
router.post('/send/otp', controller.sendOTPVerificationEmail);

/* PUT Method */
router.put('/update/inhaler', controller.addInhalertoUser);

module.exports = router;