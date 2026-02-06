import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  lectureTime: {
    type: String, // e.g. "10:00 - 11:00"
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

export default mongoose.model("Attendance", attendanceSchema);
