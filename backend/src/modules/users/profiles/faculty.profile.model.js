import mongoose from "mongoose";

const facultyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
      }
    ],

    availableSlots: [String],
    preferredSlots: [String],

    maxWeeklyHours: {
      type: Number,
      default: 16
    },

    qualification: {
      type: String,
      required: true
    },

    experienceYears: {
      type: Number,
      min: 0
    },

    designation: {
      type: String,
      enum: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"]
    }

  },
  { timestamps: true }
);

export default mongoose.model("FacultyProfile", facultyProfileSchema);
