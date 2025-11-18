import express from "express";
import { authenticate, authorizeRole } from "../middleware/auth";
import db from "../db";

const router = express.Router();

// get store owned by logged-in store owner
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
          )
        )
        .where("stores.owner_id", ownerId)
        .groupBy("stores.id")
        .first();

      if (!store) return res.status(404).json({ error: "Store not found" });

      res.json(store);
    } catch (err) {
      console.error("storeOwner /store error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// get list of users who rated this store
router.get(
  "/ratings",
  authenticate,
  authorizeRole("store_owner"),
  async (req: any, res) => {
    try {
      const ownerId = req.user.userId;

      const store = await db("stores").where("owner_id", ownerId).first();
      if (!store) return res.status(404).json({ error: "Store not found" });

      const ratings = await db("ratings")
        .join("users", "ratings.user_id", "users.id")
        .select(
          "users.name as user_name",
          "users.email as user_email",
          "ratings.rating",
          "ratings.created_at"
        )
        .where("ratings.store_id", store.id)
        .orderBy("ratings.created_at", "desc");

        const distribution = await db("ratings")
  .select("rating")
  .count("* as count")
  .where("store_id", store.id)
  .groupBy("rating");

res.json({
  store,
  ratings,
  distribution
});

      res.json({ store, ratings });
    } catch (err) {
      console.error("storeOwner /ratings error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
