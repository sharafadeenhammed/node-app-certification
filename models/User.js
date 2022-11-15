const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:[true,"please add a name"]
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter a valid email"],
        required: [true, "please add a email"],
        unique:true
    },
    role:{
        type: String,
        enum: ["User", "publisher"],
        default:"User"
        
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minLength: 6,
        select:false
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})
 

userSchema.pre("save", async function (req, res, next) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.password, salt);

    next();
});

module.exports = mongoose.model("User", userSchema);