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
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter a valid email"],
        required: [true, "please add a email"],
        
    },
    role: {
        type: String,
        enum: ["User", "publisher"],
        default: "User"
        
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minLength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
 
userSchema.pre("save", async function (req, res, next) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.password, salt);
    this.password = password;
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


module.exports = mongoose.model("User", userSchema);