import express from "express";
const router = express.Router();
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
