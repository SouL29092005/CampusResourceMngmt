import cron from "node-cron";
import Booking from "../modules/laboratory/booking.model.js";
import Equipment from "../modules/laboratory/equipment.model.js";

export const startBookingStatusJob = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const startedBookings = await Booking.find({
        status: "active",
        startTime: { $lte: now },
        endTime: { $gt: now }
      });

      for (const booking of startedBookings) {
        await Equipment.updateOne(
          { _id: booking.equipment, status: { $ne: "in-use" } },
          { $set: { status: "in-use" } }
        );
      }

      const finishedBookings = await Booking.find({
        status: "active",
        endTime: { $lte: now }
      });

      for (const booking of finishedBookings) {
        booking.status = "completed";
        await booking.save();
        
        const stillInUse = await Booking.exists({
          equipment: booking.equipment,
          status: "active",
          endTime: { $gt: now }
        });

        if (!stillInUse) {
          await Equipment.updateOne(
            { _id: booking.equipment },
            { $set: { status: "available" } }
          );
        }
      }
    } catch (err) {
      console.error("Booking status job error:", err.message);
    }
  });
};
