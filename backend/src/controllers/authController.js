const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/* ---------------- REGISTER ---------------- */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user._id)
  });
};

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  res.json({
    message: "Login successful",
    token: generateToken(user._id)
  });
};

/* ---------------- PROFILE (PROTECTED) ---------------- */
exports.profile = async (req, res) => {
  res.json(req.user);
};
