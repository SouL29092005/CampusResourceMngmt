import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "./subject.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);

// Admin-only routes
router.post("/create", protect, allowRoles("admin"), createSubject);
router.put("/update/:id", protect, allowRoles("admin"), updateSubject);
router.delete("/delete/:id", protect, allowRoles("admin"), deleteSubject);

export default router;
