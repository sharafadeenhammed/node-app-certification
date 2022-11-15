const errorResponse = require("../utils/errorResponse.js");
const Course = require("../models/Course.js");
const asyncHandeler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp.js");

//@desc     Get Courses
//@route    GET /api/v1/courses/:bootcampId
//@access   Public
exports.getCourses = asyncHandeler(async function (req,res,next){
    let query
    if(req.params.bootcampId){
        query = Course.find({bootcamp:req.params.bootcampId});
    }
    else{
        query = Course.find().populate({
            path:"bootcamp",
            select:"name description"
        });
    }

    const courses = await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
    next();
})

//@desc     Get single Course
//@route    GET /api/v1/courses/:id
//@access   Public
exports.getCourse = asyncHandeler(async function (req,res,next){
    
    const course =  await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name description"
    }); 
    if(!course){
        return next(new errorResponse(`No course with the id of ${req.params.id}`,404));
    }
    res.status(200).json({
        success:true,
        data:course
    })
    next();
})

//@desc     Add a course
//@route    Post /api/v1/bootcamp/:bootcampId/courses
//@access   Private.
exports.addCourse = asyncHandeler(async function (req,res,next){
    // manually add int to the request body
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        // return next(new errorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`,404));
        return next(new errorResponse(`No Bootcamp With The Id of ${req.params.bootcampId}`,404))
    }
    const course = await Course.create(req.body);
    const courseCount =  await Course.count();
    // console.log(courseCount);
    if(!course){
        return next(new errorResponse("cannot create course",500))
    }
    res.status(201).json({
        success:true,
        data:course
    })
    next();
});

//@desc     Update a Course...
//@route    UPDATE /api/v1/course/:id
//@access   Private.
exports.updateCourse = asyncHandeler(async function (req,res,next){
    let course = await Course.findById(req.params.id);
    if(!course){
        return next(new errorResponse(`No Course With The Id of ${req.params.id}`,404));
    }
     course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
     })
    if(!course){
        return next(new errorResponse("Cannot Update course",500));
    }
    res.status(201).json({
        success:true,
        data:course
    })
    next();
});

//@desc     Delete a Course...
//@route    DELETE /api/v1/bootcamp/:bootcampId/courses
//@access   Private.
exports.deleteCourse = asyncHandeler(async function (req,res,next){
    const course = await Course.findById(req.params.id);
    if(!course){
        return next(new errorResponse(`No Course With The Id of ${req.params.id}`,404));
    }
    course.remove();
    res.status(201).json({
        success:true,
        data:course
    })
    next();
});










// end of line...
/*
    dad ridwan account detiails...
    "0119368764"
    gtbank
*/

