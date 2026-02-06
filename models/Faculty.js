import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String
});

export default mongoose.model("Faculty", facultySchema);
