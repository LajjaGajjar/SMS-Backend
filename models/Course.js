import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: String,
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
});

export default mongoose.model("Course", courseSchema);
