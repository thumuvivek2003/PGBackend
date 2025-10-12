import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;
