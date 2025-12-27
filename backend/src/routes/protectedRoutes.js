const express = require("express");
const router = express.Router();

const {
  createEquipment,
  getAllEquipment
} = require("../controllers/equipmentController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

/**
 * @route   POST /api/equipment
 * @desc    Create new equipment
 * @access  Admin only
 */
router.post("/", protect, isAdmin, createEquipment);

/**
 * @route   GET /api/equipment
 * @desc    Get all equipment
 * @access  Protected (Admin + User)
 */
router.get("/", protect, getAllEquipment);

module.exports = router;
