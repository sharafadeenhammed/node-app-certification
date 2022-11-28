const crypto = require("crypto");
const asyncHandeler = require("../middleware/async.js")
const errorResponse = require("../utils/errorResponse.js");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); 


//@desc    register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandeler(async function (req, res, next) {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    if (!user) {
        return next(new errorResponse("can't create user",500))
    }
    sendTokenResponse(user, 201, res);
    next();
});


//@desc     login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.loginUser = asyncHandeler(async function (req, res, next) {
    const { email, password } = req.body;

     // validate email and password
    if (!email || !password) {
        return next(new errorResponse("please provide an email and password", 400));
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
        return next(new errorResponse("invalid credentials", 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new errorResponse("invalid password", 401));
    }
    sendTokenResponse(user, 200, res);
    next();
});

//@desc     get logged in user
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandeler(async function (req, res, next) {
    // if (!req.user) {
    //     return next(new errorResponse("not authorised to access this route", 401));
    // }
    res.status(200).json({
        success: true,
        data: req.user
    });

    next()

});


//@desc     forgot password
//@route    POST /api/v1/auth/me
//@access   Public
exports.forgotPassword = asyncHandeler(async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorResponse(`There is no user with the email (${req.body.email})`, 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: true });
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested the reset of a password. Please make a put request to \n\n ${resetUrl}`;
    try {
        await sendEmail({
            email:user.email,
            subject:"password reset token",
            message
        })
        res.status(200).json({
            success: true,
            data: "Email sent",
        });

    } catch (error) {
        console.log(error);
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new errorResponse("Email could not be sent", 500));
    }
    
    next();
});

//@desc     reset password
//@route    POST /api/v1/auth/forgotpassword/:resetToken
//@access   Public
exports.resetPassword = asyncHandeler(async function (req, res, next) {
    const token = req.params.resetToken;
    resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
        return next(new errorResponse("invalid token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);

});
//@desc     Update user details
//@route    PUT /api/v1/auth/updtedetails
//@access   Private
exports.updateDetails = asyncHandeler(async function (req, res, next) {
    const fieldsToUpdate = {
        name:req.body.name,
        email:req.body.email,
    }
    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators:true
    })
    if (!user) {
        return next(new errorResponse("failed to update",500 ));
    }
    res.status(200).json({
        success: true,
        msg: "update sucessful",
        data:user
    })
    next();
});

//@desc     change password
//@route    PUT /api/v1/auth/updatepassword
//@access   Private
exports.updatePassword = asyncHandeler(async function (req, res, next) {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        return next(new errorResponse("failed to change and update password as user cannot be found", 404));
    }
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new errorResponse("password incorrrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save({
        new: true,
        validateBeforeSave: true
    })
    sendTokenResponse(user, 200, res);
    next()
});



// Get token from model, create cookie and send response
const sendTokenResponse = function (user,statusCode,res) {
    const token = user.getSignedJwtToken();

    // creating cookie options
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY_DURATION * 24 * 60 * 60 * 1000),
        httpOnly:true,
    }
    // checking if the enviroment is in production and setting the secure option to true...
    if (process.env.NODE_ENV == "production") {
        options.secure = true;
    }
    // sending response with the cookie and 
    res.status(statusCode)
        .cookie("token", token, options)
        .send({
            success: true,
            token,
        });

}
