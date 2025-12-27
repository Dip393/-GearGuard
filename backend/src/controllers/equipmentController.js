const Equipment = require("../models/Equipment");

/**
 * @desc    Create new equipment
 * @route   POST /api/equipment
 * @access  Protected
 */
exports.createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      serialNumber,
      department,
      location,
      maintenanceTeam,
      warrantyExpiry,
      purchaseDate,
      vendor
    } = req.body;

    // Basic required fields check
    if (!name || !serialNumber || !department || !location || !maintenanceTeam) {
      res.status(400);
      throw new Error("Required equipment fields missing");
    }

    // Create equipment
    const equipment = await Equipment.create({
      name,
      serialNumber,
      department,
      location,
      maintenanceTeam,
      warrantyExpiry,
      purchaseDate,
      vendor
    });

    res.status(201).json({
      status: "success",
      message: "Equipment created successfully",
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all equipment
 * @route   GET /api/equipment
 * @access  Protected
 */
exports.getAllEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find()
      .populate("maintenanceTeam", "name");

    res.status(200).json({
      status: "success",
      results: equipment.length,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};
