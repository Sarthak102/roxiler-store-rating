// backend/src/controllers/ratingController.ts
import db from "../db";
import { Request, Response } from "express";

type AuthUser = { userId?: string; role?: string };

/**
 * Submit or update a rating for a store by the authenticated user.
 * Expects authenticate middleware to populate req.user with { userId, role }.
 */
export const submitOrUpdateRating = async (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const userId = user?.userId;
  const { storeId } = req.params;
  const { rating, comment } = req.body;

  if (!userId) return res.status(401).json({ error: "Missing user" });

  // validate rating
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res
      .status(400)
      .json({ error: "Rating must be integer between 1 and 5" });
  }

  try {
    const existing = await db("ratings")
      .where({ user_id: userId, store_id: storeId })
      .first();

    if (existing) {
      const [updated] = await db("ratings")
        .where({ id: existing.id })
        .update({
          rating: r,
          comment: comment || null,
          updated_at: db.fn.now(),
        })
        .returning("*");
      return res.json({ rating: updated });
    }

    const [inserted] = await db("ratings")
      .insert({
        user_id: userId,
        store_id: storeId,
        rating: r,
        comment: comment || null,
      })
      .returning("*");

    return res.status(201).json({ rating: inserted });
  } catch (err) {
    console.error("submitOrUpdateRating error:", err);
    return res.status(500).json({ error: "Server error while saving rating" });
  }
};

export const getRatingsForStore = async (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const userId = user?.userId;
  const { storeId } = req.params;

  const store = await db("stores").where({ id: storeId }).first();
  if (!store) return res.status(404).json({ error: "Store not found" });

  if (user?.role !== "admin" && userId !== store.owner_id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const ratings = await db("ratings")
    .where({ store_id: storeId })
    .orderBy("created_at", "desc");
  res.json({ data: ratings });
};

export async function createOrUpdateRating(req: any, res: Response) {
  try {
    const userId = req.user.userId;
    const storeId = req.params.id;
    const { rating, comment } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating" });
    }

    const existing = await db("ratings")
      .where({ store_id: storeId, user_id: userId })
      .first();

    if (existing) {
      await db("ratings")
        .where({ id: existing.id })
        .update({ rating, comment: comment ?? null, updated_at: db.fn.now() });
      return res.json({ message: "updated" });
    } else {
      const id = crypto.randomUUID();
      await db("ratings").insert({
        id,
        rating,
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
