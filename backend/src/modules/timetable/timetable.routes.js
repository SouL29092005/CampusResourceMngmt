import { Router } from "express";
import { createClass } from "./class.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { generateTimetableController } from "./timetable.controller.js";

const router = Router();

// ADMIN ONLY: Create a new class
router.post(
  "/createClass",
  protect,
  allowRoles("ADMIN"),
  createClass
);

router.post(
  "/generate",
  protect,
  allowRoles("admin"),
  generateTimetableController
);

export default router;