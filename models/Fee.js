import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  amount: Number,
  status: {
    type: String,
    enum: ["paid", "pending"],
    default: "paid",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Fee", feeSchema);
