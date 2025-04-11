
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "please add a name"]
    },
    email: {
        type: String,
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter a valid email"],
        required: [true, "please add a email"],
    },
    role: {
        type: String,
        trim:true,
        enum: ["User", "publisher"],
        default: "User"
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minLength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordExpire: Date,
    resetPasswordToken: String,
});

// 
userSchema.pre("save", async function (req, res, next) {
    if (this.password && this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(this.password, salt);
        this.password = await password;
    }
    next(); 
});

// signed jwt and return 
userSchema.methods.getSignedJwtToken = function () {
     return jwt.sign({
        id: this._id
      },  process.env.JWT_SECRET, { expiresIn:  process.env.JWT_EXPIRY_DURATION});
}

// match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// generate and hash password token
userSchema.methods.getResetPasswordToken = function () {

    // generate token.
    const resetToken = crypto.randomBytes(20).toString("hex")
   
    // hash token and set to the resetPasswordToken field;
    this.resetPasswordToken = crypto.createHash("sha256")
                                .update(resetToken)
                                .digest("hex");

    // set expire duration to 10 mins.
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken
}

module.exports = mongoose.model("User", userSchema);
