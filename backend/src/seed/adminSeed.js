const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  await User.create({
    name: "Admin",
    email: "admin@gearguard.com",
    password: "123456",
    role: "admin"
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
