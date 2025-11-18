// backend/src/routes/admin.ts
import express from "express";
import { createUser } from "../controllers/adminController";
import { authenticate, authorizeRole } from "../middleware/auth";
import { validateAdminCreate } from "../validators/adminValidators";

const router = express.Router();

router.post(
  "/users",
  authenticate,
  authorizeRole("admin"),
  validateAdminCreate,
  createUser
);

export default router;
