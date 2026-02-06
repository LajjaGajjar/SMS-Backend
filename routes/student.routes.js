import express from "express";
import Announcement from "../models/Announcement.js";
import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();
router.use(protect, authorize("student"));

router.get("/announcements", async (req, res) => {
  res.json(await Announcement.find());
});

router.get("/assignments", async (req, res) => {
  res.json(await Assignment.find());
});

router.get("/attendance", async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = await Attendance.find({
      studentId: student._id,
    }).populate("courseId", "name");

    res.json(attendance);
  } catch (err) {
    console.error("STUDENT ATTENDANCE ERROR:", err.message);
    res.status(500).json({ message: "Failed to load attendance" });
  }
});

/* ===============================
   GET STUDENT COURSES
   =============================== */
router.get("/courses", async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courses = await Course.find({
      _id: { $in: student.courses }
    }).populate({
      path: "facultyId",
      populate: { path: "userId", select: "name" }
    });

    res.json(courses);
  } catch (err) {
    console.error("STUDENT COURSES ERROR:", err.message);
    res.status(500).json({ message: "Failed to load courses" });
  }
});

router.get("/marks", async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    const records = await Marks.find({ studentId: student._id })
      .populate("courseId", "name");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to load marks" });
  }
});

router.post("/pay-fee", async (req, res) => {
  try {
    const { amount } = req.body;

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fee = await Fee.create({
      studentId: student._id,
      amount,
      status: "paid",
    });

    res.json(fee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fee payment failed" });
  }
});

router.post("/pay-fee", async (req, res) => {
  const fee = await Fee.create({
    studentId: req.user.id,
    amount: req.body.amount,
    status: "paid",
    paymentDate: new Date()
  });
  res.json(fee);
});

export default router;
