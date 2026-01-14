import { Router } from "express";
import { createClass } from "./timetable.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

// ADMIN ONLY: Create a new class
router.post(
  "/createClass",
  protect,
  allowRoles("ADMIN"),
  createClass
);

export default router;