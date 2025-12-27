const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    /* ---------------- TEAM IDENTITY ---------------- */

    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    /* ---------------- EXPERTISE ---------------- */

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    /* ---------------- CAPACITY ---------------- */

    membersCount: {
      type: Number,
      required: true,
      min: 1
    },

    /* ---------------- AVAILABILITY ---------------- */

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Team", teamSchema);
