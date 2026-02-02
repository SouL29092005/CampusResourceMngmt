import express from "express";
import {
  addRoom,
  deactivateRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deactivateRoomBooking,
  reactivateRoom,
  reactivateRoomBooking
} from "./room.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles }  from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/addRoom",
  protect,
  allowRoles("admin"),
  addRoom
);

router.patch(
  "/:roomId/deactivate",
  protect,
  allowRoles("admin"),
  deactivateRoom
);

router.patch(
  "/:roomId/reactivate",
  protect,
  allowRoles("admin"),
  reactivateRoom
);

router.patch(
  "/:roomId/bookable/reactivate",
  protect,
  allowRoles("admin"),
  reactivateRoomBooking
);


router.get(
  "/getRooms",
  protect,
  getAllRooms
);

router.get(
  "/:roomId",
  protect,
  getRoomById
);

router.patch(
  "/:roomId/bookable",
  protect,
  allowRoles("admin"),
  deactivateRoomBooking
);

router.patch(
  "/:roomId/update",
  protect,
  allowRoles("admin"),
  updateRoom
);

export default router;
