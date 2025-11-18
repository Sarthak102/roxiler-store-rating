import db from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const register = async (req: any, res: any) => {
  const { name, email, password, address, role } = req.body;

  const exists = await db("users").where({ email }).first();
  if (exists)
    return res.status(409).json({ error: "Email already registered" });

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

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, user });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await db("users").where({ email }).first();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, user });
};

router.post("/change-password", authenticate, changePassword);