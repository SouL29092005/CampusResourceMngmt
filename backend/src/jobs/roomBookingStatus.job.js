import cron from "node-cron";
import RoomBooking from "../modules/room/roomBooking.model.js";

export const startRoomBookingStatusJob = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const expiredBookings = await RoomBooking.find({
        status: "active",
        endTime: { $lte: now }
      });

      for (const booking of expiredBookings) {
        booking.status = "expired";
        await booking.save();
      }
    } catch (err) {
      console.error(
        "Room booking status cron error:",
        err.message
      );
    }
  });
};
