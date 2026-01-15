import express from "express";
import { login, changePassword } from "./auth.controller.js";
//import { getMe } from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/change-password", protect, changePassword);

// Verify token & get current user 
// router.get("/me", protect, getMe);

export default router;
