import express from "express";
import { register, login } from "../";
import { validateRegister, validateLogin } from "../validators/authValidators";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
