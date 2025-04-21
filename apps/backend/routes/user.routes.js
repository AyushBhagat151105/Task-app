import express from "express";
import "dotenv/config";
import {
  login,
  registerUser,
  verifEmail,
} from "../controller/User.controller.js";
import { isVerifyed } from "../middleware/isVerifyed.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifEmail);
router.post("/login", isVerifyed, login);

export default router;
