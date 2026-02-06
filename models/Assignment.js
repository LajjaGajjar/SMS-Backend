import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Assignment", assignmentSchema);
