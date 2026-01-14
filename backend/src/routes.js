import express from "express";

import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import timetableRoutes from "./modules/timetable/timetable.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/timetable", timetableRoutes);

export default router;
