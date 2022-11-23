const jwt = require("jsonwebtoken");
const asyncHandeler = require("./async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// protect route
exports.protect = asyncHandeler(async function (req, res, next) {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    /*
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    */
    
    // make sure token is sent
    if (!token) {
        return next(new errorResponse("not authorised to access this route", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
        
    } catch (error) {
    
        return next(new errorResponse("not authorised to access this route", 401));
    }
});

// Grant Access to Specific Roles
exports.authorise = (...roles) => {
    return function (req,res,next) {
        if (!roles.includes(req.user.role)) {
            return next(new errorResponse(`user role ${req.user.role} is not authorised to access this route`,401))
        }
        next();
    }

}  
