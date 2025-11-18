// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body;

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

  // optional audit log
  try {
    await db("audit_logs").insert({
      actor_id: (req as any).user?.userId ?? null,
      action: "create_user",
      details: JSON.stringify({ created_user: user.id, role }),
      created_at: db.fn.now(),
    });
  } catch (err) {
    console.error("audit log failed", err);
  }

  res.status(201).json({ user });
};
