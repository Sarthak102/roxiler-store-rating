import express, { Request, Response } from "express";
import db from "../db";

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
router.get(
  "/store-owners",
  authenticate,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
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

router.post(
  "/stores",
  authenticate,
  authorizeRole("admin"),
  async (req: any, res) => {
    try {
      const { name, email, address, owner_id } = req.body;

      if (!name) return res.status(400).json({ error: "Name is required" });

      const id = crypto.randomUUID();
      await db("stores").insert({
        id,
        name,
        email,
        address,
        owner_id: owner_id || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      const store = await db("stores").where({ id }).first();
      res.status(201).json({ store });
    } catch (err) {
      console.error("admin create store error", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
export default router;
