// backend/src/controllers/ratingController.ts
import { Request, Response } from "express";
import db from "../db";
import crypto from "crypto";

type AuthUser = { userId?: string; role?: string };

// --- POST /api/stores/:id/ratings ---
// Create or update rating by the authenticated user for a store
export async function createOrUpdateRating(req: Request, res: Response) {
  try {
    const user = (req as any).user as AuthUser;
    const userId = user?.userId;
    const storeId = req.params.id;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Missing user" });
    }

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: "Invalid rating" });
    }

    const existing = await db("ratings")
      .where({ store_id: storeId, user_id: userId })
      .first();

    if (existing) {
      await db("ratings")
        .where({ id: existing.id })
        .update({
          rating: r,
          comment: comment ?? null,
          updated_at: db.fn.now(),
        });

      return res.json({ message: "updated" });
    } else {
      const id = crypto.randomUUID();
      await db("ratings").insert({
        id,
        rating: r,
        comment: comment ?? null,
        user_id: userId,
        store_id: storeId,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      return res.status(201).json({ message: "created" });
    }
  } catch (err) {
    console.error("createOrUpdateRating err", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// --- GET /api/stores/:storeId/ratings ---
// Used by admin / store owner to inspect all ratings for one store
export const getRatingsForStore = async (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const userId = user?.userId;
  const role = user?.role;
  const { storeId } = req.params;

  try {
    const store = await db("stores").where({ id: storeId }).first();
    if (!store) return res.status(404).json({ error: "Store not found" });

    // admin or store owner (owner_id matches userId)
    if (role !== "admin" && userId !== store.owner_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const ratings = await db("ratings")
      .where({ store_id: storeId })
      .orderBy("created_at", "desc");

    return res.json({ data: ratings });
  } catch (err) {
    console.error("getRatingsForStore err", err);
    return res.status(500).json({ error: "Server error" });
  }
};
