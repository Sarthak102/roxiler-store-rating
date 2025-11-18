// backend/src/routes/admin.ts
import express from "express";
import {
  createUserByAdmin,
  getStats,
  listUsers,
  getUserById,
} from "../controllers/adminController";
import { authenticate } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";
import { validateAdminCreate } from "../validators/adminValidators";

const router = express.Router();

router.get("/stats", authenticate, authorizeRole("admin"), getStats);
router.get("/users", authenticate, authorizeRole("admin"), listUsers);
router.get("/users/:id", authenticate, authorizeRole("admin"), getUserById);
router.post(
  "/users",
  authenticate,
  authorizeRole("admin"),
  validateAdminCreate,
  createUserByAdmin
);

export default router;
