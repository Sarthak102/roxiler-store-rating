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
import db from "../db";

const router = express.Router();

router.get("/stats", authenticate, authorizeRole("admin"), getStats);
router.get("/users", authenticate, authorizeRole("admin"), listUsers);
router.get("/users/:id", authenticate, authorizeRole("admin"), getUserById);
router.get(
  "/store-owners",
  authenticate,
  authorizeRole("admin"),
  async (req: any, res) => {
    try {
      const owners = await db("users")
        .select("id", "name", "email")
        .where({ role: "store_owner" })
        .orderBy("name", "asc");

      res.json(owners);
    } catch (err) {
      console.error("get store owners err", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.post(
  "/users",
  authenticate,
  authorizeRole("admin"),
  validateAdminCreate,
  createUserByAdmin
);

export default router;
