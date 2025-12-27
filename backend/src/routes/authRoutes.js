const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

// Register
router.post("/register", asyncHandler(register));

// Login
router.post("/login", asyncHandler(login));

// Profile (Protected)
router.get("/profile", protect, asyncHandler(profile));

module.exports = router;
