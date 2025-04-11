const errorResponse = require("../utils/errorResponse.js");
const Course = require("../models/Course.js");
const asyncHandeler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp.js");

//@desc     Get Courses
//@route    GET /api/v1/courses/:bootcampId
//@access   Public
exports.getCourses = asyncHandeler(async function (req,res,next){
  
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        if (courses.length === 0) {
            return next(new errorResponse(`can't find Bootcamp with ID of ${req.params.bootcampId}`, 404));
        }
        res.status(200).json({
            success: true,
            msg: `showing courses where bootcamp ID is ${req.params.bootcampId}`,
            count: courses.length,
            data: courses
        })
     
    }
    else {
        res.status(200).json(res.searchResult);
    }
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
    // manually add bootcamp to the request body
    req.body.bootcamp = req.params.bootcampId;

    // manually aadding user to request body
    req.body.user = req.user._id;
    const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new errorResponse(`No Bootcamp With The Id of ${req.params.bootcampId}`, 404));
    }

   // Make sure the user is the bootcamp owner
   if (req.user._id.toString() !== bootcamp.user.toString() && req.user.role !== "admin") {
        return next(new errorResponse(`user  ${req.user._id} is not authorised to add a course to bootcamp ${bootcamp._id}`, 401))
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

    // Make sure the user is the bootcamp owner
   if (req.user._id.toString() !== course.user.toString() && req.user.role !== "admin") {
    return next(new errorResponse(`user  ${req.user._id} is not authorised to update course ${course._id}`, 401))
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

     // Make sure the user is the bootcamp owner
   if (req.user._id.toString() !== course.user.toString() && req.user.role !== "admin") {
    return next(new errorResponse(`user  ${req.user._id} is not authorised to delete course ${course._id}`, 401))
    }
    course.remove();
    res.status(201).json({
        success:true,
        data:course
    })
    next();
});








