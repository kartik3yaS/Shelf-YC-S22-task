const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// @route   GET /api/users/profile
router.get("/profile", auth, userController.getUserProfile);

// @route   PUT /api/users/profile
router.put("/profile", auth, userController.updateUserProfile);

module.exports = router;
