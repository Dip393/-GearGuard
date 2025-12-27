const getSLAInMs = (priority) => {
  switch (priority) {
    case "high":
      return 1 * 24 * 60 * 60 * 1000; // 1 day
    case "medium":
      return 3 * 24 * 60 * 60 * 1000; // 3 days
    case "low":
      return 5 * 24 * 60 * 60 * 1000; // 5 days
    default:
      return 3 * 24 * 60 * 60 * 1000;
  }
};


const MaintenanceRequest = require("../models/MaintenanceRequest");
const Equipment = require("../models/Equipment");

/**
 * @desc    Create maintenance request
 * @route   POST /api/requests
 * @access  Protected
 */
exports.createRequest = async (req, res, next) => {
  try {
    const { equipmentId, issueTitle, issueDescription, priority } = req.body;

    // 1️⃣ Basic validation
    if (!equipmentId || !issueTitle || !issueDescription) {
      res.status(400);
      throw new Error("Required request fields missing");
    }

    // 2️⃣ Find equipment
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      res.status(404);
      throw new Error("Equipment not found");
    }

    // 3️⃣ Block requests for scrap equipment
    if (equipment.status === "scrap") {
      res.status(400);
      throw new Error("Cannot create request for scrap equipment");
    }

    // 4️⃣ Auto-assign maintenance team from equipment
    const request = await MaintenanceRequest.create({
      equipment: equipment._id,
      requestedBy: req.user._id,
      assignedTeam: equipment.maintenanceTeam,
      issueTitle,
      issueDescription,
      priority
    });

    res.status(201).json({
      status: "success",
      message: "Maintenance request created successfully",
      data: request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get maintenance requests
 * @route   GET /api/requests
 * @access  Protected
 */
exports.getAllRequests = async (req, res, next) => {
  try {
    let query = {};

    // Admin can see all requests
    if (req.user.role !== "admin") {
      // Normal users see only their own requests
      query.requestedBy = req.user._id;
    }

    const requests = await MaintenanceRequest.find(query)
      .populate("equipment", "name serialNumber location")
      .populate("assignedTeam", "name code")
      .populate("requestedBy", "name email");

        const now = Date.now();

        const enrichedRequests = requests.map((req) => {
        const sla = getSLAInMs(req.priority);
        const isOverdue =
            req.status !== "completed" &&
            now > new Date(req.createdAt).getTime() + sla;

        return {
            ...req.toObject(),
            isOverdue
        };
    });

        res.status(200).json({
        status: "success",
        results: enrichedRequests.length,
        data: enrichedRequests
        });

  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Update maintenance request status
 * @route   PATCH /api/requests/:id/status
 * @access  Admin only
 */
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    // 1️⃣ Validate status
    const allowedStatus = ["new", "in_progress", "completed"];
    if (!allowedStatus.includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    // 2️⃣ Find request
    const request = await MaintenanceRequest.findById(requestId);
    if (!request) {
      res.status(404);
      throw new Error("Maintenance request not found");
    }

    // 3️⃣ Enforce status transitions
    const currentStatus = request.status;

    const validTransitions = {
      new: ["in_progress"],
      in_progress: ["completed"],
      completed: []
    };

    if (!validTransitions[currentStatus].includes(status)) {
      res.status(400);
      throw new Error(
        `Invalid status transition from '${currentStatus}' to '${status}'`
      );
    }

    // 4️⃣ Update status
    request.status = status;

    // 5️⃣ Set completion timestamp
    if (status === "completed") {
      request.completedAt = new Date();
    }

    await request.save();

    res.status(200).json({
      status: "success",
      message: "Request status updated successfully",
      data: request
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get dashboard statistics
 * @route   GET /api/requests/dashboard
 * @access  Protected
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const matchStage =
      req.user.role === "admin"
        ? {}
        : { requestedBy: req.user._id };

    const stats = await MaintenanceRequest.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await MaintenanceRequest.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await MaintenanceRequest.countDocuments(matchStage);

    res.status(200).json({
      status: "success",
      data: {
        totalRequests: total,
        statusBreakdown: stats,
        priorityBreakdown: priorityStats
      }
    });
  } catch (error) {
    next(error);
  }
};
