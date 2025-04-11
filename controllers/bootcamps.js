const asyncHandeler = require("../middleware/async.js")
const geocoder = require("../utils/geocoder.js");
const errorResponse = require("../utils/errorResponse.js");
const path = require("path");
const Bootcamp = require("../models/Bootcamp");

//@desc     get all botcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandeler(async function(req,res,next){
    res.status(200).json(res.searchResult);
    next();
 })

    
//@desc     get single botcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandeler(async function (req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");
    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with an ID of ${req.params.id}`, 404)
        )
    }
    res.status(200).json({ success: true, msg: `showing bootcamp where ID is ${req.params.id}`, Data: bootcamp });
    next();
});

//@desc     get bootcamps within a radius
//@route    GET/api/v1/bootcamps/radius/:zipcode/:distance
//@access   private
exports.getBootcampsInRadius = asyncHandeler(async(req,res,next)=>{
    const {zipcode,distance} = req.params
    // get latitude and longitude from geocoder
    const loc  = await geocoder.geocode(zipcode);
    const lati = loc[0].latitude;
    const long = loc[0].longitude;
    // claculate radius using radians
    //divide distance by the radius of the earth 3964m or 6378Km
    const radius = distance/3963;
    const bootcamps =  await Bootcamp.find({"location.coordinates":{$geoWithin:{$centerSphere:[[long , lati], radius]}
     }});
    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    });
    next();
})

//@desc     create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandeler(async function (req, res, next) {
    req.body.createdAt = Date.now();
    // add user to the req.body
    req.body.user = req.user._id;

    // check for published bootcamp
    publishedBootcamp = await Bootcamp.findOne({ user: req.user._id });

    //check if user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== "admin") {
        return next(new errorResponse(`the user with ID ${req.user._id} has already published a bootcamp`,400));
    }
    data = await Bootcamp.create(req.body);
    if (!data) {
        return next(new errorResponse("can't create bootcamp",500));
    }
    res.status(201).json({
        success: true, msg: "created a new bootcamp",
        data: data
    })
    next();
});

//@desc    update bootcamp
//@route   PUT /api/v1/bootcamps/:id
//@access  Private
exports.updateBootcamp = asyncHandeler(async function (req, res, next) {

    let bootcamp = await Bootcamp.findById(req.params.id)
    
    // checking if the bootcamp exist
    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with an ID of ${req.params.id}`, 404))
            
    }

    // Make sure the user is the bootcamp owner
    if (req.user._id.toString() !== bootcamp.user.toString() && req.user.role !== "admin") {
        return next(new errorResponse(`user  ${req.user._id} is not authorised to update this bootcamp`, 401))
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    // bootcamp = await bootcamp.update(req.body);
    res.status(201).json({ success: true, msg: `updated bootcamp where ID is ${req.params.id}`, Data: bootcamp });
    next();
});

//@desc    delete bootcamp
//@route   DELETE /api/v1/bootcamps/:id
//@access  Private
exports.deleteBootcamp = asyncHandeler(async function(req,res,next){
  
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next( new errorResponse( `Bootcamp not found with an ID of ${req.params.id}`,404))
    }

     // Make sure the user is the bootcamp owner
     if (req.user._id.toString() !== bootcamp.user.toString() && req.user.role !== "admin") {
        return next(new errorResponse(`user  ${req.user._id} is not authorised to delete this bootcamp`, 401))
    }
    
    bootcamp.remove();
    res.status(201).json({success:true,msg:`deleted bootcamp where ID is ${req.params.id}`,Data:bootcamp});
     next();
})

//@desc    upload photo for bootcamp
//@route   PUT /api/v1/bootcamps/:id/photo
//@access  Private
exports.bootcampPhotoUpload = asyncHandeler(async function (req, res, next) {
    const bootcamp = Bootcamp.findById(req.params.id);
    file = req.files.undefined;
    
    //creating custom file name
    file.name = `photo_${req.params.id}${path.extname(file.name)}`;

    // check if the bootcamp exists
    if (!bootcamp) {
        return next( new errorResponse( `Bootcamp not found with an ID of ${req.params.id}`,404))
    }

    // Make sure the user is the bootcamp owner
    if (req.user._id.toString() !== bootcamp.user.toString() && req.user.role !== "admin") {
        return next(new errorResponse(`user  ${req.user._id} is not authorised to upload photo to this bootcamp`, 401))
    }
    
    // check if files is uploaded
    if (!req.files) {
        next( new errorResponse( "please upload a photo file",400))
    }

    // check file if it is a photo
    if (!file.mimetype.startsWith("image")) {
       return next( new errorResponse( "please upload a valid photo file",400))
    }

    // check if file is not more than 1mb
    if (file.size>process.env.MAX_FILE_UPLOAD) {
       return next( new errorResponse( `please upload a photo file of size less than ${process.env.MAX_FILE_UPLOAD}`,400))
    }
    
    // saving the file to uploads
    file.mv(path.join(__dirname,"..","public","uploads",file.name), async function(err){
        if (err) {
            console.log(err)
            return next(new errorResponse("Error uplaoding photo", 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
        res.status(201).json({
            status: true,
            filename: file.name
        })
        // console.log("file name: ", file);
    });
   
    
})
