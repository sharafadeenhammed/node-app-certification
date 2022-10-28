const Bootcamp = require("../models/Bootcamp.js")
const asyncHandeler = require("../middleware/async.js")
const geocoder = require("../utils/geocoder.js");
// const { json, query } = require("express");

//@desc     get all botcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandeler(async function(req,res,next){
    // making a copy of req.query
    const reqQuery = {...req.query};

    //fields to exclude for filtering
    const removeFields = ["select","sort","limit","page"];

    //loop over removeFields and delete from reqQuery
    removeFields.forEach(field=> delete reqQuery[field])

    //creating a query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators like $gt,$gte,etc
    queryStr = queryStr.replace(/\b(gt|gte|le|lte|in)\b/g, match=>`$${match}`);

    // finding resourse
    let query = Bootcamp.find(JSON.parse(queryStr));

    //selecting fields
    if(req.query.select){
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();
    query =  query.skip(startIndex).limit(limit)
    let pagination = {};

    //sort result fields
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }
    // else{
    // query = query.sort("-createdAt");
    // }
    

    //executing query
    const bootcamps = await query;
    
    // setting the fields on tghe pagination object;
    if(endIndex < total){
        pagination.next = {
            page: page+1,
            limit: limit
        }
    }
    if(startIndex > 1){
        pagination.prev = {
            page : page-1,
            limit: limit
        }
    }
    if(bootcamps.length == 0){
        pagination = {};
    }

    res.status(200).json({success:true,msg:"show all bootcamps",count:bootcamps.length,pagination,Data:bootcamps});
    next();
})

    
//@desc     get single botcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandeler(async function(req,res,next){
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
           return next({
                message:`Bootcamp not found with an ID of ${req.params.id}`,
                name:"wrong ID",
                statusCode:404
            })
        }
        res.status(200).json({success:true,msg:`showing bootcamp where ID is ${req.params.id}`,Data:bootcamp});
        next();
})

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
        status:true,
        count:bootcamps.length,
        data:bootcamps
    });
    next();
})

//@desc     create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandeler( async function(req,res,next){
    req.body.createdAt = Date.now();
        data = await Bootcamp.create(req.body)
        res.status(201).json({success:true,msg:"create new bootcamp",
        data:data})
        next();
})

//@desc    update bootcamp
//@route   PUT /api/v1/bootcamps/:id
//@access  Private
exports.updateBootcamp = asyncHandeler( async function(req,res,next){
   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
        if(!bootcamp){
            return next({
                message:`cannot update bootcamp, as Bootcamp not found with an ID of ${req.params.id}`,
                name:"wrong ID",
                statusCode:404
            })
        }
        res.status(201).json({success:true,msg:`update bootcamp where ID is ${req.params.id}`,Data:bootcamp});
        next();
})

//@desc    delete bootcamp
//@route   DELETE /api/v1/bootcamps/:id
//@access  Private
exports.deleteBootcamp = asyncHandeler(async function(req,res,next){
  
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next({
                message:`cannot delete bootcamp, as Bootcamp not found with an ID of ${req.params.id}`,
                name:"wrong ID",
                statusCode:404
            })
            
        }
        res.status(201).json({success:true,msg:`deleted bootcamp where ID is ${req.params.id}`,Data:bootcamp});
        next();
})
