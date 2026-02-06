import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
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
  exam: {
    type: String, // e.g. "Mid Sem", "Unit Test 1"
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Marks", marksSchema);
