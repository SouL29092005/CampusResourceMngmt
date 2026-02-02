import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { createRoomBooking, cancelRoomBooking, getAllRoomBookings } from "./roomBooking.controller.js";

const router = express.Router();

router.post(
  "/room-booking",
  protect,
  allowRoles("admin", "faculty"),
  createRoomBooking
);

router.patch(
  "/room-booking/:bookingId/cancel",
  protect,
  allowRoles("admin", "faculty"),
  cancelRoomBooking
);

router.get(
  "/room-bookings",
  protect,
  allowRoles("admin"),
  getAllRoomBookings
);

export default router;