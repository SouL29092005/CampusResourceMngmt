import cron from "node-cron";
import RoomBooking from "../modules/room/roomBooking.model.js";

export const startRoomBookingStatusJob = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    console.log(`[RoomBookingStatusJob] checking for expired bookings at ${now.toISOString()}`);

    try {
      const result = await RoomBooking.updateMany(
        { status: "active", endTime: { $lte: now } },
        { $set: { status: "expired" } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`[RoomBookingStatusJob] expired ${result.modifiedCount} booking(s)`);
      } else {
        console.log(`[RoomBookingStatusJob] no bookings expired`);
      }
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
