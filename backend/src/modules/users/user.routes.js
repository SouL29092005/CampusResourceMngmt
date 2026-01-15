import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
  createUserByAdmin,
  deleteUserByAdmin
} from "./user.controller.js";

const router = express.Router();

// Admin-only routes
router.post(
  "/admin/create",
  protect,
  allowRoles("admin"),
  createUserByAdmin
);

router.delete(
  "/admin/:id",
  protect,
  allowRoles("admin"),
  deleteUserByAdmin
);

export default router;
