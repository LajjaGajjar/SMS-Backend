import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
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

export default mongoose.model("Announcement", announcementSchema);
