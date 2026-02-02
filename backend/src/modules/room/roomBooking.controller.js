import RoomBooking from "./roomBooking.model.js";
import TimetableEntry from "../timetable/timetableEntry.model.js";
import RoomBookingCounter from "../../utils/roomBookingCounter.model.js";

export const getNextBookingNumber = async () => {
  const counter = await RoomBookingCounter.findOneAndUpdate(
    { name: "roomBooking" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};


export const createRoomBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);

    if (bookingStart >= bookingEnd) {
      return res.status(400).json({
        message: "End time must be after start time"
      });
    }

    const existingBooking = await RoomBooking.findOne({
      roomId,
      status: "active",
      startTime: { $lt: bookingEnd },
      endTime: { $gt: bookingStart }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "Room already booked for this time slot"
      });
    }

    const dayOfWeek = bookingStart.toLocaleString("en-US", {
      weekday: "long"
    });

    const startMinutes =
      bookingStart.getHours() * 60 + bookingStart.getMinutes();

    const endMinutes =
      bookingEnd.getHours() * 60 + bookingEnd.getMinutes();

    const timetableEntries = await TimetableEntry.find({
      roomId,
      dayOfWeek
    });

    const timetableClash = timetableEntries.some(entry => {
      const [sh, sm] = entry.startTime.split(":").map(Number);
      const [eh, em] = entry.endTime.split(":").map(Number);

      const entryStart = sh * 60 + sm;
      const entryEnd = eh * 60 + em;

      return startMinutes < entryEnd && endMinutes > entryStart;
    });

    if (timetableClash) {
      return res.status(409).json({
        message: "Room has a scheduled class during this time"
      });
    }

    const bookingNumber = await getNextBookingNumber();

    const booking = await RoomBooking.create({
      bookingNumber,
      roomId,
      bookedBy: req.user._id,
      startTime: bookingStart,
      endTime: bookingEnd
    });

    res.status(201).json({
      message: "Room booked successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const cancelRoomBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await RoomBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Only

export const getAllRoomBookings = async (req, res) => {
  try {
    const { status, bookedBy } = req.query;

    const filter = {};

    // ----------------------------
    // Filter by status
    // ----------------------------
    if (status) {
      filter.status = status; // active | cancelled | expired
    }

    // ----------------------------
    // Filter by who booked
    // ----------------------------
    if (bookedBy === "me") {
      filter.bookedBy = req.user._id;
    } 
    else if (bookedBy === "others") {
      filter.bookedBy = { $ne: req.user._id };
    }

    const bookings = await RoomBooking.find(filter)
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

