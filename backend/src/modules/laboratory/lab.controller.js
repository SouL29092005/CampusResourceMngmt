import { createEquipment, 
  updateEquipmentService, 
  createBooking, 
  cancelBooking, 
  getAllActiveBookings, 
  getAllEquipmentsService, 
  deleteEquipmentById,
  getBookingsByUser,
  getFreeSlots as getFreeSlotsService } from "./lab.service.js";
import User from "../users/user.model.js";

export const addEquipment = async (req, res) => {
  try {
    const { name, description, labName, location, maintainedByEmail } = req.body;

    let finalMaintainedBy;

    if (req.user.role === "lab_admin") {
      finalMaintainedBy = req.user._id; 
    }
    
    if (req.user.role === "admin") {
      if (!maintainedByEmail) {
        throw new Error("maintainedBy is required for admin");
      }
      const user = await User.findOne({
        email: maintainedByEmail,
        role: "lab_admin"
      });

      if (!user) {
        throw new Error("No lab admin found with this email");
      }
      finalMaintainedBy = user._id;
    }

    const equipment = await createEquipment({
      name,
      description,
      labName,
      location,
      maintainedBy: finalMaintainedBy
    });

    res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      equipment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { equipmentNumber } = req.params;

    const equipment = await updateEquipmentService({
      equipmentNumber,
      updates: req.body,
      requesterRole: req.user.role,
      requesterUserId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      equipment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const bookEquipment = async (req, res) => {
  try {
    console.log("BOOK EQUIPMENT REQUEST", { body: req.body, user: req.user?._id });
    const { equipmentNumber, startTime, endTime } = req.body;

    const booking = await createBooking({
      equipmentNumber,
      userId: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("BOOK EQUIPMENT ERROR", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cancelEquipmentBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await cancelBooking(
      bookingId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getFreeSlots = async (req, res) => {
  try {
    const { equipmentNumber } = req.params;
    const slots = await getFreeSlotsService(Number(equipmentNumber));

    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await getBookingsByUser(req.user._id);

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const getAllActiveEquipmentBookings = async (req, res) => {
  try {
    const bookings = await getAllActiveBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAllEquipments = async (req, res) => {
  try {
    const equipments = await getAllEquipmentsService();

    res.status(200).json({
      success: true,
      equipments
    });
  } catch (err) {
    console.error("GET ALL EQUIPMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteEquipmentById(id);

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

