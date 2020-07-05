const express = require("express");
const router = express.Router();
import { validateLogin, validateSignup } from "../validator/auth";
import { loginController, signupController } from "../controller/auth";

router.post("/login", validateLogin, loginController);

router.post("/signup", validateSignup, signupController);

module.exports = router;
