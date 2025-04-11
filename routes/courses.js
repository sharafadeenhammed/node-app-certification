const {Router} = require("express")
const router = Router({mergeParams:true});
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courses");

const {
    protect
} = require("../middleware/auth") 

const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");
populate = {
    path: "bootcamp",
    select:"name description address"
}
 
router.route("/")
    .get(advancedResults(Course, populate), getCourses)
    .post(protect, addCourse);
router.route("/:id")
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);


module.exports = router;