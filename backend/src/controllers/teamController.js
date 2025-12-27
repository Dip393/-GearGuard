const Team = require("../models/Team");

/**
 * @desc    Create maintenance team
 * @route   POST /api/teams
 * @access  Admin only
 */
exports.createTeam = async (req, res, next) => {
  try {
    const { name, code, specialization, membersCount } = req.body;

    // Required fields check
    if (!name || !code || !specialization || !membersCount) {
      res.status(400);
      throw new Error("All team fields are required");
    }

    const team = await Team.create({
      name,
      code,
      specialization,
      membersCount
    });

    res.status(201).json({
      status: "success",
      message: "Maintenance team created successfully",
      data: team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all maintenance teams
 * @route   GET /api/teams
 * @access  Protected
 */
exports.getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      status: "success",
      results: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};
