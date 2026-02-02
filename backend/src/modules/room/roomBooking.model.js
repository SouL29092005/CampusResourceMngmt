import mongoose from "mongoose";
import Room from "./room.model.js";

const roomBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: Number,
      unique: true
    },

    roomId: {
      type: String,
      required: true
    },

    roomType: {
      type: String,
      required: true
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["active", "cancelled", "expired"],
      default: "active"
    }
  },
  { timestamps: true }
);

roomBookingSchema.pre("validate", async function () {
  if (this.roomType) return;

  const room = await Room.findOne({ roomId: this.roomId });

  if (!room) {
    throw new Error(`Room with ID ${this.roomId} not found`);
  }

  this.roomType = room.roomType;
});

const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);

export default RoomBooking;
