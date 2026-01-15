import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    weeklyHours: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    type: {
      type: String,
      enum: ["LECTURE", "LAB", "TUTORIAL"],
      default: "LECTURE",
    },
  },
  {
    timestamps: true,
  }
);

export const SubjectModel = mongoose.model("Subject", subjectSchema);