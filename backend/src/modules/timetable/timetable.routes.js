import express from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { uploadTimetableCSV, getAllTimetableEntries } from "./timetable.controller.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/"
});

router.post(
  "/upload",
  protect,
  allowRoles("admin"),
  upload.single("file"),
  uploadTimetableCSV
);

router.get(
  "/getTimetable",
  protect,
  allowRoles("admin"),
  getAllTimetableEntries
);

export default router;
