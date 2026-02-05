import cron from "node-cron";
import RoomBooking from "../modules/room/roomBooking.model.js";

export const startRoomBookingStatusJob = () => {
  cron.schedule("20 * * * * *", async () => {
    const now = new Date();

    try {
      const result = await RoomBooking.updateMany(
        { status: "active", endTime: { $lte: now } },
        { $set: { status: "expired" } }
      );
    } catch (err) {
      console.error(
        "Room booking status cron error:",
        err.message
      );
    }
  });
};

export const runRoomBookingStatusNow = async () => {
  const now = new Date();
  const result = await RoomBooking.updateMany(
    { status: "active", endTime: { $lte: now } },
    { $set: { status: "expired" } }
  );
  return result;
};
