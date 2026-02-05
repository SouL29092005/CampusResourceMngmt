import express from "express";

import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import timetableRoutes from "./modules/timetable/timetable.routes.js";
import profileRoutes from "./modules/users/profile.routes.js";
import subjectRoutes from "./modules/timetable/course.routes.js";
import libraryRoutes from "./modules/library/library.routes.js";
import labRoutes from "./modules/laboratory/lab.routes.js";
import roomRoutes from "./modules/room/room.routes.js";
import timetableRotues from "./modules/timetable/timetable.routes.js";
import roomBookingRoutes from "./modules/room/roomBooking.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/users", profileRoutes);
router.use("/auth", authRoutes);
router.use("/timetable", timetableRoutes);
router.use("/subject", subjectRoutes);
router.use("/library", libraryRoutes);
router.use("/lab", labRoutes);
router.use("/room", roomRoutes);
router.use("/timetable", timetableRotues);
router.use("/roomBooking", roomBookingRoutes);

export default router;
