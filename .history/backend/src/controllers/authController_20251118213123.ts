// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

type JwtPayload = { userId: string; role: string };

export const register = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body;

  try {
    const exists = await db("users").where({ email }).first();
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [user] = await db("users")
      .insert({
        name,
        email,
        password_hash: hash,
        address: address || null,
        role: role || "user",
      })
      .returning("*");

    const token = jwt.sign(
      { userId: user.id, role: user.role } as JwtPayload,
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("register err", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role } as JwtPayload,
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("login err", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(403).json({ error: "Current password is incorrect" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db("users")
      .where({ id: userId })
      .update({ password_hash: hash, updated_at: db.fn.now() });

    return res.json({ success: true });
  } catch (err) {
    console.error("changePassword err", err);
    return res.status(500).json({ error: "Server error" });
  }
};
