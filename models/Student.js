import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rollNo: String,
  department: String,
  year: Number,

  // ✅ REQUIRED FOR COURSE ASSIGNMENT
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: [],
    },
  ],
});

export default mongoose.model("Student", studentSchema);
