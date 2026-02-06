import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});

// TEMP ADMIN CREATION (DELETE AFTER USE)
router.post("/create-admin", async (req, res) => {
  const existing = await User.findOne({ email: "admin@sms.com" });
  if (existing) {
    return res.json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@sms.com",
    password: hashedPassword,
    role: "admin",
  });

  res.json({ message: "Admin created successfully" });
});

// ONE-TIME ADMIN CREATION (DEV ONLY)
router.get("/init-admin", async (req, res) => {
  try {
    await User.deleteMany({ role: "admin" });

    const hashed = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@sms.com",
      password: hashed,
      role: "admin",
    });

    res.json({
      message: "Admin created",
      email: admin.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating admin" });
  }
});


export default router;   // 🔥 THIS LINE WAS MISSING
