import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    dueAt: {
      type: Date,
      required: true,
    },
    returnedAt: Date,
    status: {
      type: String,
      enum: ["ISSUED", "RETURNED", "OVERDUE"],
      default: "ISSUED",
      index: true,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
