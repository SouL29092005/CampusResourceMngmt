import Equipment from "./equipment.model.js";
import CounterLab from "../../utils/counterLab.model.js";
import LabAdminProfile from "../users/profiles/labAdmin.profile.model.js";
import Booking from "./booking.model.js";


const getNextEquipmentNumber = async () => {
  const counter = await CounterLab.findOneAndUpdate(
    { name: "equipmentNumber" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};


export const createEquipment = async ({
  name,
  description,
  labName,
  location,
  maintainedBy
}) => {
  const labAdmin = await LabAdminProfile.findOne({ userId: maintainedBy });

  if (!labAdmin) {
    throw new Error("Lab admin profile not found");
  }

  const equipmentNumber = await getNextEquipmentNumber();

  const equipment = await Equipment.create({
    equipmentNumber,
    name,
    description,
    labName,
    location,
    maintainedBy
  });

  labAdmin.managedEquipment.push(equipment._id);
  await labAdmin.save();

  return equipment;
};

export const updateEquipmentService = async ({
  equipmentNumber,
  updates,
  requesterRole,
  requesterUserId
}) => {
  const equipment = await Equipment.findOne({ equipmentNumber });

  if (!equipment) {
    throw new Error("Equipment not found");
  }

  if (
    requesterRole === "lab_admin" &&
    equipment.maintainedBy.toString() !== requesterUserId.toString()
  ) {
    throw new Error("Unauthorized to update this equipment");
  }

  delete updates.equipmentNumber;
  delete updates.maintainedBy;

  Object.assign(equipment, updates);
  await equipment.save();

  return equipment;
};


const hasOverlap = async (equipmentNumber, startTime, endTime) => {
  return await Booking.exists({
    equipmentNumber,
    status: "active",
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
};

export const createBooking = async ({
  equipmentNumber,
  userId,
  startTime,
  endTime
}) => {
  const now = new Date();
  const maxAllowedDate = new Date();
  maxAllowedDate.setDate(now.getDate() + 3);

  if (startTime > maxAllowedDate) {
    throw new Error("Cannot book equipment beyond next 3 days");
  }

  const equipment = await Equipment.findOne({ equipmentNumber });
  if (!equipment) throw new Error("Equipment not found");

  const overlap = await hasOverlap(equipmentNumber, startTime, endTime);
  if (overlap) {
    throw new Error("Equipment already booked for this time slot");
  }

  return await Booking.create({
    equipment: equipment._id,
    equipmentNumber,
    bookedBy: userId,
    nowTime: now,
    startTime,
    endTime
  });
};

export const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.bookedBy.toString() !== userId.toString()) {
    throw new Error("Unauthorized cancellation");
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};

export const getFreeSlots = async (equipmentNumber) => {
  const now = new Date();
  const endWindow = new Date();
  endWindow.setDate(now.getDate() + 3);

  const bookings = await Booking.find({
    equipmentNumber,
    status: "active",
    endTime: { $gte: now }
  }).sort("startTime");

  let freeSlots = [];
  let cursor = now;

  for (const booking of bookings) {
    if (cursor < booking.startTime) {
      freeSlots.push({
        freeFrom: cursor,
        freeTo: booking.startTime
      });
    }
    cursor = new Date(Math.max(cursor, booking.endTime));
  }

  if (cursor < endWindow) {
    freeSlots.push({
      freeFrom: cursor,
      freeTo: endWindow
    });
  }

  return freeSlots;
};

export const getAllActiveBookings = async () => {
  return await Booking.find({ status: "active" })
    .populate("equipment", "name labName location equipmentNumber")
    .populate("bookedBy", "name email")
    .sort({ startTime: 1 });
};

export const getAllEquipmentsService = async () => {
  return await Equipment.find()
    .populate({
      path: "maintainedBy",
      populate: {
        path: "userId",
        select: "name email"
      }
    })
    .sort({ createdAt: -1 });
};

export const deleteEquipmentById = async (equipmentId) => {
  const equipment = await Equipment.findById(equipmentId);

  if (!equipment) {
    throw new Error("Equipment not found");
  }

  await LabAdminProfile.updateOne(
    { _id: equipment.maintainedBy },
    { $pull: { managedEquipment: equipment._id } }
  );

  await equipment.deleteOne();

  return equipment;
};
