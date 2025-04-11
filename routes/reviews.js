const {Router} = require("express")
const router = Router({mergeParams:true});
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviews");

const {
    protect,
    authorise
} = require("../middleware/auth")

const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/Review");
const populate = {
    path: "bootcamp",
    select:"name description"
}

router.route("/")
    .get(advancedResults(Review, populate), getReviews)
    .post(protect, authorise("admin", "User"), createReview);

router.route("/:id")
    .get(getReview)
    .put(protect,authorise("User","admin"),updateReview)
    .delete(protect,authorise("User","admin"),deleteReview);


module.exports = router;