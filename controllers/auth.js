const asyncHandeler = require("../middleware/async.js")
const errorResponse = require("../utils/errorResponse.js");
const User = require("../models/User");


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
    const token = user.getSignedJwtToken();
    res.status(201).json({
        success: true,
        token
    });
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
    const user = await User.findOne({email:email}).select("+password");
    if (!user) {
        return next(new errorResponse("invalid credentials", 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new errorResponse("invalid password", 401));
    }

    const token = user.getSignedJwtToken();
    res.status(200).json({
        success: true,
        token
    });
    next();


    
    next();
});