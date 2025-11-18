import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";

// Admin creates a user with a role (admin|user|store_owner)
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body;

  // check if already exists
  const existing = await db("users").where({ email }).first();
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const hash = await bcrypt.hash(password, 10);
  const [user] = await db("users")
    .insert({
      name,
      email,
      password_hash: hash,
      address: address || null,
      role: role || "user",
    })
    .returning(["id", "name", "email", "role"]);

  // Optional: write audit log
  try {
    await db("audit_logs").insert({
      actor_id: (req as any).user?.userId ?? null,
      action: "create_user",
      details: JSON.stringify({ created_user: user.id, role }),
      created_at: db.fn.now(),
    });
  } catch (err) {
    // don't fail user creation if audit fails; just log
    console.error("audit log failed", err);
  }

  res.status(201).json({ user });
};
