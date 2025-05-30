import express from "express";
import "dotenv/config";
import {
  dashboard,
  forgotPassword,
  login,
  logout,
  registerUser,
  resetPassword,
  verifEmail,
} from "../controller/User.controller.js";
import { isVerifyed } from "../middleware/isVerifyed.js";
import { isLogin } from "../middleware/isLogin.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifEmail);
router.post("/login", isVerifyed, login);
router.get("/dashboard", isLogin, dashboard);
router.get("/logout", isLogin, logout);
router.post("/forgotpassword", isVerifyed, isLogin, forgotPassword);
router.post("/resetpassword/:token", resetPassword);

export default router;
