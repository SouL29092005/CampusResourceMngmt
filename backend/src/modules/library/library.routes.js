import express from "express";
import { addBooks } from "./library.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/books",
  auth,
  role("LIBRARIAN", "ADMIN"),
  addBooks
);

export default router;
