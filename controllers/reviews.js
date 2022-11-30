const errorResponse = require("../utils/errorResponse.js");
const Course = require("../models/Course.js");
const Bootcamp = require("../models/Bootcamp.js");
const asyncHandeler = require("../middleware/async");
const Review = require("../models/Review.js");

//@desc     Get reviews
//@route    GET /api/v1/bootcamps/:bootcampId/reviews
//@access   Public
exports.getReviews = asyncHandeler(async function (req, res, next) {
    if (req.params.bootcampId) {
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if (!bootcamp) {
            return next(new errorResponse(`bootcamp with the ID of ${req.params.bootcampId} does not exist`, 404));
        }
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
       
    } else {
        res.status(200).json(res.searchResult);
        next();
    }
});

//@desc     Get single review
//@route    GET /api/v1/reviews/:id
//@access   Public
exports.getReview = asyncHandeler(async function (req, res, next) {
    const findReview = await Review.findById(req.params.id);
    if (!findReview) {
        return next(new errorResponse(`course with the ID of ${req.params.id} does not exist`, 404))
    }
    const review = await findReview.populate([{
        path: "bootcamp",
        select: "name description"
    }, {
        path: "user",
        select: "name email role -_id"
    }])
    res.status(200).json({
        success: true,
        data: review

    });
});

//@desc     Get single review
//@route    POST /api/v1/reviews/:id
//@access   private
exports.createReview = asyncHandeler(async function (req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new errorResponse(`bootcamp with the ID of ${req.params.bootcampId} does not exist`, 404))
    }
    req.body.user = req.user._id;
    req.body.bootcamp = req.params.bootcampId;
    const review = await Review.create(req.body);
    res.status(200).json({
        success: true,
        data: review

    });
});