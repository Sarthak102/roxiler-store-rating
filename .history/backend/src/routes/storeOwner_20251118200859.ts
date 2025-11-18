// backend/src/routes/storeOwner.ts
import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";

const router = express.Router();

/**
 * GET /api/store-owner/store
 * Single store summary (for dashboard) – keeps previous behaviour.
 */
router.get(
  "/store",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;

      const store = await db("stores")
        .leftJoin("ratings", "stores.id", "ratings.store_id")
        .select(
          "stores.id",
          "stores.name",
          "stores.email",
          "stores.address",
          db.raw(
            "COALESCE(AVG(ratings.rating), 0)::numeric(10,2) as avg_rating"
          ),
          db.raw("COUNT(ratings.id) as ratings_count")
        )
        .where("stores.owner_id", ownerId)
        .groupBy("stores.id")
        .orderBy("stores.created_at", "asc")
        .first();

      if (!store) return res.status(404).json({ error: "Store not found" });
      return res.json(store);
    } catch (err) {
      console.error("GET /store-owner/store error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET /api/store-owner/ratings
 * Backwards compatible endpoint used by dashboard – returns first store + ratings + distribution.
 */
router.get(
  "/ratings",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;

      const store = await db("stores")
        .where("owner_id", ownerId)
        .orderBy("created_at", "asc")
        .first();
      if (!store) return res.status(404).json({ error: "Store not found" });

      const ratings = await db("ratings")
        .join("users", "ratings.user_id", "users.id")
        .select(
          "users.id as user_id",
          "users.name as user_name",
          "users.email as user_email",
          "ratings.rating",
          "ratings.comment",
          "ratings.created_at"
        )
        .where("ratings.store_id", store.id)
        .orderBy("ratings.created_at", "desc");

      const distributionRows = await db("ratings")
        .select("rating")
        .count("* as count")
        .where("store_id", store.id)
        .groupBy("rating")
        .orderBy("rating", "desc");

      const distribution = [5, 4, 3, 2, 1].map((r) => {
        const row = distributionRows.find((d: any) => Number(d.rating) === r);
        return { rating: r, count: row ? Number(row.count) : 0 };
      });

      return res.json({ store, ratings, distribution });
    } catch (err) {
      console.error("GET /store-owner/ratings error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * NEW: GET /api/store-owner/stores
 * List ALL stores owned by this store_owner, with avg + count.
 */
router.get(
  "/stores",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;

      const stores = await db("stores")
        .leftJoin("ratings", "stores.id", "ratings.store_id")
        .select(
          "stores.id",
          "stores.name",
          "stores.address",
          db.raw(
            "COALESCE(AVG(ratings.rating), 0)::numeric(10,2) as avg_rating"
          ),
          db.raw("COUNT(ratings.id) as ratings_count")
        )
        .where("stores.owner_id", ownerId)
        .groupBy("stores.id")
        .orderBy("stores.created_at", "asc");

      return res.json(stores);
    } catch (err) {
      console.error("GET /store-owner/stores error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * NEW: GET /api/store-owner/stores/:id/ratings
 * Ratings for a specific store (ensuring it belongs to this owner).
 */
router.get(
  "/stores/:id/ratings",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;
      const storeId = req.params.id;

      const store = await db("stores")
        .where({ id: storeId, owner_id: ownerId })
        .first();

      if (!store) {
        return res
          .status(404)
          .json({ error: "Store not found or not owned by this user" });
      }

      const ratings = await db("ratings")
        .join("users", "ratings.user_id", "users.id")
        .select(
          "users.id as user_id",
          "users.name as user_name",
          "users.email as user_email",
          "ratings.rating",
          "ratings.comment",
          "ratings.created_at"
        )
        .where("ratings.store_id", store.id)
        .orderBy("ratings.created_at", "desc");

      return res.json({ store, ratings });
    } catch (err) {
      console.error("GET /store-owner/stores/:id/ratings error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// backend/src/routes/storeOwner.ts (ONLY this route needs to change)
router.get(
  "/stores/:id/ratings",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;
      const storeId = req.params.id;

      // store with avg_rating + ratings_count, ensuring ownership
      const store = await db("stores")
        .leftJoin("ratings", "stores.id", "ratings.store_id")
        .select(
          "stores.id",
          "stores.name",
          "stores.address",
          db.raw(
            "COALESCE(AVG(ratings.rating), 0)::numeric(10,2) as avg_rating"
          ),
          db.raw("COUNT(ratings.id) as ratings_count")
        )
        .where("stores.id", storeId)
        .andWhere("stores.owner_id", ownerId)
        .groupBy("stores.id")
        .first();

      if (!store) {
        return res
          .status(404)
          .json({ error: "Store not found or not owned by this user" });
      }

      const ratings = await db("ratings")
        .join("users", "ratings.user_id", "users.id")
        .select(
          "users.id as user_id",
          "users.name as user_name",
          "users.email as user_email",
          "ratings.rating",
          "ratings.comment",
          "ratings.created_at"
        )
        .where("ratings.store_id", store.id)
        .orderBy("ratings.created_at", "desc");

      return res.json({ store, ratings });
    } catch (err) {
      console.error("GET /store-owner/stores/:id/ratings error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
