import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    semester: {
      type: Number,
      required: true
    },

    enrolledSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
      }
    ],

    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookIssue"
      }
    ],

    activeEquipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquipmentUsage"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
