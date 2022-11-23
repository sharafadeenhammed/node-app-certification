const express = require("express");
const { Router } = require("express");
const {
    protect,
    authorise
}= require("../middleware/auth")
const {
    registerUser,
    loginUser,
    getMe,
    forgotPassword
 } = require("../controllers/auth");

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);



module.exports = router;
