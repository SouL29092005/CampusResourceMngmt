import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },

    equipmentNumber: {
      type: Number,
      required: true
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    nowTime: {
      type: Date,
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    }
  },
  { timestamps: true }
);

bookingSchema.pre("save", function () {
  const now = new Date();

  if (this.endTime <= this.startTime) {
    throw new Error("End time must be after start time");
  }

  const diffMs = this.endTime - this.startTime;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 2) {
    throw new Error("Maximum booking duration is 2 days");
  }

  const maxStartTime = new Date(now);
  maxStartTime.setDate(maxStartTime.getDate() + 3);

  if (this.startTime > maxStartTime) {
    throw new Error("Booking start time must be within the next 3 days");
  }

  // all validations passed
  return;
});

export default mongoose.model("Booking", bookingSchema);
