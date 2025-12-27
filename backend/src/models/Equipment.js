const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC IDENTITY ---------------- */

    name: {
      type: String,
      required: true,
      trim: true
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    /* ---------------- LOCATION & OWNERSHIP ---------------- */

    department: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    /* ---------------- MAINTENANCE MAPPING ---------------- */

    maintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },

    /* ---------------- LIFECYCLE STATUS ---------------- */

    status: {
      type: String,
      enum: ["working", "maintenance", "scrap"],
      default: "working"
    },

    /* ---------------- OPTIONAL METADATA ---------------- */

    warrantyExpiry: {
      type: Date
    },

    purchaseDate: {
      type: Date
    },

    vendor: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
