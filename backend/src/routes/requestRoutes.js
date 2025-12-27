const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/requests
 * @desc    Create maintenance request
 * @access  Protected
 */
router.post("/", protect, createRequest);

/**
 * @route   GET /api/requests
 * @desc    Get maintenance requests
 * @access  Protected
 */
router.get("/", protect, getAllRequests);

const { updateRequestStatus } = require("../controllers/requestController");
const { isAdmin } = require("../middleware/roleMiddleware");

/**
 * @route   PATCH /api/requests/:id/status
 * @desc    Update maintenance request status
 * @access  Admin only
 */
router.patch("/:id/status", protect, isAdmin, updateRequestStatus);


const { getDashboardStats } = require("../controllers/requestController");

/**
 * @route   GET /api/requests/dashboard
 * @desc    Get dashboard statistics
 * @access  Protected
 */
router.get("/dashboard", protect, getDashboardStats);


module.exports = router;
