import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Fee from "../models/Fee.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

// GET ALL STUDENTS
router.get("/students", async (req, res) => {
  const students = await Student.find().populate("userId", "name email").populate("courses","name");
  res.json(students);
});

// GET ALL FACULTY
router.get("/faculty", async (req, res) => {
  const faculty = await Faculty.find().populate("userId", "name email");
  res.json(faculty);
});

/* CREATE COURSE */
router.post("/courses", async (req, res) => {
  const { name, code, facultyId } = req.body;

  const course = await Course.create({
    name,
    code,
    facultyId,
  });

  res.json(course);
});

/* ASSIGN COURSES TO STUDENT */
router.post("/addcourses", async (req, res) => {
  try {
    const { studentId, courseIds } = req.body;

    if (!studentId || !courseIds || courseIds.length === 0) {
      return res.status(400).json({ message: "Student and courses required" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { courses: courseIds },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error("ASSIGN COURSE ERROR:", err.message);
    res.status(500).json({ message: "Failed to assign courses" });
  }
});

/* GET ALL COURSES */
router.get("/courses", async (req, res) => {
  const courses = await Course.find()
    .populate({
      path: "facultyId",
      populate: { path: "userId", select: "name email" },
    });

  res.json(courses);
});

/* GET FACULTY LIST (FOR DROPDOWN) */
router.get("/faculty-list", async (req, res) => {
  const faculty = await Faculty.find().populate("userId", "name email");
  res.json(faculty);
});

router.get("/fees", async (req, res) => {
  const fees = await Fee.find()
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

  res.json(fees);
});

router.post("/add-student", async (req, res) => {
  const { name, email, password, rollNo, department, year } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "student" });
  await Student.create({ userId: user._id, rollNo, department, year });

  res.json({ message: "Student added" });
});

router.post("/add-faculty", async (req, res) => {
  const { name, email, password, department } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "faculty" });
  await Faculty.create({ userId: user._id, department });

  res.json({ message: "Faculty added" });
});

router.get("/fees", async (req, res) => {
  const fees = await Fee.find();
  res.json(fees);
});

router.get("/dashboard", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();

    // If Fee model exists
    let totalFees = 0;
    if (Fee) {
      const fees = await Fee.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      totalFees = fees[0]?.total || 0;
    }

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      totalFees,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err.message);
    res.status(500).json({ message: "Dashboard load failed" });
  }
});

export default router;
