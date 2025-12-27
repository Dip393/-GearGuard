const express = require("express");
const router = express.Router();

const {
  createTeam,
  getAllTeams
} = require("../controllers/teamController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

/**
 * @route   POST /api/teams
 * @desc    Create maintenance team
 * @access  Admin only
 */
router.post("/", protect, isAdmin, createTeam);

/**
 * @route   GET /api/teams
 * @desc    Get all maintenance teams
 * @access  Protected (Admin + User)
 */
router.get("/", protect, getAllTeams);

module.exports = router;
