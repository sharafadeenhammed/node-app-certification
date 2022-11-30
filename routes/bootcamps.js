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

// include other resourse router(courses)...
const courseRouter = require("./courses.js");
router.use("/:bootcampId/courses", courseRouter);

// include other resourse router(reviews)...
const reviewRouter = require("./reviews.js");
router.use("/:bootcampId/reviews",reviewRouter);




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

module.exports=router;
