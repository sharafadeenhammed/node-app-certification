const {Router}= require("express");
const router = Router();
const {
        getBootcamps,
        getBootcamp,
        updateBootcamp,
        deleteBootcamp,
        createBootcamp,
        getBootcampsInRadius,
        bootcampPhotoUpload,
        
} = require("../controllers/bootcamps.js");

const advancedResults = require("../middleware/advancedResults.js");

const Bootcamp = require("../models/Bootcamp.js");

const {
    protect,
    authorise
} = require("../middleware/auth") 

// include other resourse router...
const courseRouter = require("./courses.js");
router.use("/:bootcampId/courses",courseRouter);

router.route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(protect, authorise("admin","publisher"), createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(protect, authorise("admin","publisher"), updateBootcamp)
    .delete(protect, authorise("admin","publisher"), deleteBootcamp);

router.route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius);

router.route("/:id/photo")
    .put(protect, authorise("admin","publisher"), bootcampPhotoUpload);

/*
    // creating a get route on "/api/v1/bootcamps"
    router.get("/",getBootcamps);

    //get a specific bootcamp
    router.get("/:id",getBootcamp);

    //creating a post route on "/api/v1/bootcamps"
    router.post("/",createBootcamp);

    //creating a put route on "/api/v1/bootcamps"
    router.put("/:id",updateBootcamp);

    //creating a delete route on "/api/v1/bootcamps"
    router.delete("/:id",deleteBootcamp);
*/

module.exports=router;
