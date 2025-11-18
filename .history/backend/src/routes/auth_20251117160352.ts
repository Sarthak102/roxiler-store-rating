import express from "express";
import { register, login } from "../controllers/authController";
import { validateRegister, validateLogin } from "../validators/authValidators";
import { changePassword } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/change-password", authenticate, changePassword);

export default router;
