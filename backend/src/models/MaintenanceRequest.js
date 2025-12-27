const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    /* ---------------- CORE REFERENCES ---------------- */

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },

    /* ---------------- ISSUE DETAILS ---------------- */

    issueTitle: {
      type: String,
      required: true,
      trim: true
    },

    issueDescription: {
      type: String,
      required: true,
      trim: true
    },

    /* ---------------- WORKFLOW STATUS ---------------- */

    status: {
      type: String,
      enum: ["new", "in_progress", "completed"],
      default: "new"
    },

    /* ---------------- PRIORITY ---------------- */

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    /* ---------------- COMPLETION TRACKING ---------------- */

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema
);
