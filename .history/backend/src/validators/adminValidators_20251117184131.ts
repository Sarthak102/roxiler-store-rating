// backend/src/validators/adminValidators.ts
import { Request, Response, NextFunction } from "express";

export function validateAdminCreate(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }

  // minimal name length (change if you like)
  if (String(name).trim().length < 3) {
    return res.status(400).json({ error: "name must be at least 3 characters" });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(String(email))) {
    return res.status(400).json({ error: "invalid email" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ error: "password too short (min 8 characters)" });
  }

  return next();
}