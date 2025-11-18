import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authenticate = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorizeRole = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
