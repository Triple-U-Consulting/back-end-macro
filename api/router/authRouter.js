const express = require("express");
const router = express.Router();
const controller = require("../../controller/userController");
const { validateToken } = require("../../jwt/jwt");

router.post("/register", controller.userRegister);
router.get('/', controller.getAllUserData);
router.post("/login", controller.userLogin);
router.get("/profile", validateToken, controller.mockTest);
router.put('/update/inhaler', controller.addInhalertoUser);
//router.get("/:user_id", controller.getUserDataById);

module.exports = router;
