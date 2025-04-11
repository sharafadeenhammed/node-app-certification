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
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
 } = require("../controllers/auth");

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword/", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.get("/logout",protect, logout);



module.exports = router;
