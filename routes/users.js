const { Router } = require("express");
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser

} = require("../controllers/users")

const {
    protect,
    authorise
} = require("../middleware/auth")

const router = Router();

router.use(protect);
router.use(authorise("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;