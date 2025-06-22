// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js"; // ✅ import Portfolio model

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ username, email, password });

  // ✅ Create portfolio with initial balance
  const portfolio = new Portfolio({
    user: user._id,
    balance: 100000,
    stocks: [],
  });
  await portfolio.save();

  const token = generateToken(user._id);
  res.status(201).json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id);
  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
