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
