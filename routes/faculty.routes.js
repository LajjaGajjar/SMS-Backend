import express from "express";
import Faculty from "../models/Faculty.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import Assignment from "../models/Assignment.js";
import Announcement from "../models/Announcement.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   GET FACULTY COURSES
   ===================================================== */
router.get("/courses", protect, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user.id });
    const courses = await Course.find({ facultyId: faculty._id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to load courses" });
  }
});

/* GET STUDENTS OF A COURSE */
router.get("/course-students/:courseId", protect, async (req, res) => {
  try {
    const students = await Student.find({
      courses: req.params.courseId,
    }).populate("userId", "name");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to load students" });
  }
});

/* SAVE ATTENDANCE */
router.post("/attendance", protect, async (req, res) => {
  try {
    const { courseId, date, lectureTime, records } = req.body;
    if (!courseId || !date || !lectureTime || !records?.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const docs = records.map(r => ({
      studentId: r.studentId,
      courseId,
      date,
      lectureTime,
      status: r.status,
    }));

    await Attendance.insertMany(docs);
    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Attendance failed" });
  }
});

/* SAVE MARKS */
router.post("/marks", protect, async (req, res) => {
  try {
    const { courseId, exam, maxMarks, records } = req.body;
    if (!courseId || !exam || !maxMarks || !records?.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const docs = records.map(r => ({
      studentId: r.studentId,
      courseId,
      exam,
      maxMarks,
      marksObtained: r.marksObtained,
    }));

    await Marks.insertMany(docs);
    res.json({ message: "Marks saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save marks" });
  }
});

/* CREATE ANNOUNCEMENT */
router.post("/announcement", protect, async (req, res) => {
  try {
    const { title, message, courseId } = req.body;
    if (!title || !message || !courseId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const faculty = await Faculty.findOne({ userId: req.user.id });

    const announcement = await Announcement.create({
      title,
      message,
      courseId,
      facultyId: faculty._id,
    });

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to post announcement" });
  }
});

/* RECENT ANNOUNCEMENTS */
router.get("/recent-announcements", protect, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("courseId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Failed to load announcements" });
  }
});

/* =====================================================
   CREATE ASSIGNMENT
   ===================================================== */
router.post("/assignments", protect, async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;

    if (!title || !description || !dueDate || !courseId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const faculty = await Faculty.findOne({ userId: req.user.id });

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      courseId,
      facultyId: faculty._id,
    });

    res.json(assignment);
  } catch (err) {
    console.error("ASSIGNMENT ERROR:", err.message);
    res.status(500).json({ message: "Failed to create assignment" });
  }
});

/* =====================================================
   GET FACULTY ASSIGNMENTS
   ===================================================== */
router.get("/assignments", protect, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user.id });

    const assignments = await Assignment.find({ facultyId: faculty._id })
      .populate("courseId", "name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load assignments" });
  }
});


export default router;
