import express from "express";
import { addEquipment, 
  updateEquipment, 
  bookEquipment, 
  cancelEquipmentBooking, 
  getAllActiveEquipmentBookings, 
  getAllEquipments,
  deleteEquipment,
  getUserBookings,
  getFreeSlots } from "./lab.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js"

const router = express.Router();

router.post(
  "/addEquipment",
  protect,
  allowRoles("admin", "lab_admin"),
  addEquipment
);

router.patch(
  "/updateEquipment/:equipmentNumber",
  protect,
  allowRoles("admin", "lab_admin"),
  updateEquipment
);

router.post(
  "/equipment/book",
  protect,
  allowRoles("student"),
  bookEquipment
);

router.get(
  "/bookings/my",
  protect,
  allowRoles("student"),
  getUserBookings
);

router.patch(
  "/booking/:bookingId/cancel",
  protect,
  allowRoles("student"),
  cancelEquipmentBooking
);

router.get(
  "/equipment/:equipmentNumber/free-slots",
  protect,
  allowRoles("student"),
  getFreeSlots
);

router.get(
  "/bookings/active",
  protect,
  allowRoles("admin", "lab_admin"),
  getAllActiveEquipmentBookings
);

router.get(
  "/getEquipments",
  protect,
  allowRoles("admin", "lab_admin", "student"),
  getAllEquipments
)

router.delete(
  "/equipment/:id",
  protect,
  allowRoles("admin", "lab_admin"),
  deleteEquipment
);



export default router;
