import mongoose from "mongoose";

const roomBookingCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const RoomBookingCounter = mongoose.model(
  "RoomBookingCounter",
  roomBookingCounterSchema
);

export default RoomBookingCounter;
