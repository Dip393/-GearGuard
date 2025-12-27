const express = require("express");
const router = express.Router();

const {
  createEquipment,
  getAllEquipment
} = require("../controllers/equipmentController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/equipment
 * @desc    Create new equipment
 * @access  Protected
 */
router.post("/", protect, createEquipment);

/**
 * @route   GET /api/equipment
 * @desc    Get all equipment
 * @access  Protected
 */
router.get("/", protect, getAllEquipment);

module.exports = router;
