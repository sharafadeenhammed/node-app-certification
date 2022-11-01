const {Router}= require("express");
const router = Router();
const {
        getBootcamps,
        getBootcamp,
        updateBootcamp,
        deleteBootcamp,
        createBootcamp,
        getBootcampsInRadius,
        
      } = require("../controllers/bootcamps.js");

// include other resourse router...
const courseRouter = require("./courses.js");
router.use("/:bootcampId/courses",courseRouter);

router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

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
