import express from "express";
import { getStats, listUsers, getUserById, createUserByAdmin } from "../controllers/adminController";
import { authenticate } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize"; // optional role guard

const router = express.Router();

// protect routes by authenticate and require admin role
router.get("/stats", authenticate, authorizeRole("admin"), getStats);
router.get("/users", authenticate, authorizeRole("admin"), listUsers);
router.get("/users/:id", authenticate, authorizeRole("admin"), getUserById);
router.post("/users", authenticate, authorizeRole("admin"), createUserByAdmin);

export default router;