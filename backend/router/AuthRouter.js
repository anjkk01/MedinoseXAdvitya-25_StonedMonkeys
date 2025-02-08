const express = require("express");
const router = express.Router();
const validateForm= require("../controllers/validateForm.js")
const {handleLogin, attemptLogin, attemptRegister}= require("../controllers/AuthController.js")

router.route("/login")
.get(handleLogin)
.post(validateForm,attemptLogin)
router.post("/signup",validateForm,attemptRegister)

module.exports = router;