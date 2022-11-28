const asyncHandeler = require("../middleware/async.js")
const errorResponse = require("../utils/errorResponse.js");
const User = require("../models/User");

//@desc     Get all users
//@route    GET /api/v1/users
//@access   PRIVATE ADMIN
exports.getUsers = asyncHandeler(async function (req, res, next) {
    res.status(200).json(res.searchResult);
    next();
});

//@desc     get single user
//@route    GET /api/v1/users/:id
//@access   PRIVATE ADMIN
exports.getUser = asyncHandeler(async function (req, res, next) {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new errorResponse(`No user With The Id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        msg:`showing user with id of ${req.params.id} `,
        data: user
    });
    next();
});

//@desc     Create user
//@route    POST /api/v1/users
//@access   PRIVATE ADMIN
exports.createUser = asyncHandeler(async function (req, res, next) {
    const user = await User.create(req.body);
    if (!user) {
        return next(new errorResponse("Cannot create new user at this time", 500));
    }
    res.status(201).json({
        success: true,
        msg:"user created sucessfully",
        data: user
    });
    next();
});

//@desc     Update user
//@route    PUT /api/v1/auth/:id
//@access   PRIVATE ADMIN
exports.updateUser = asyncHandeler(async function (req, res, next) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new errorResponse("Cannot update user",404));
    }
    res.status(200).json({
        success: true,
        msg:"user updated sucessfully",
        data: user
    });
    next();
})

//@desc     Delete user
//@route    DELETE /api/v1/users/:id
//@access   PRIVATE ADMIN
exports.deleteUser = asyncHandeler(async function (req, res, next) {
    await User.findByIdAndDelete(req.params.id);
    res.status(201).json({
        success: true,
        msg:"user deleted sucessfully",
        data: {}
    });
    next();
})