// backend/src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";

export function authorizeRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== requiredRole)
      return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}
