import db from "../db";

export const submitOrUpdateRating = async (req: any, res: any) => {
  const { storeId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  const existing = await db("ratings")
    .where({ user_id: userId, store_id: storeId })
    .first();

  if (existing) {
    const [updated] = await db("ratings")
      .where({ id: existing.id })
      .update({ rating, comment, updated_at: db.fn.now() })
      .returning("*");

    return res.json({ rating: updated });
  }

  const [inserted] = await db("ratings")
    .insert({ user_id: userId, store_id: storeId, rating, comment })
    .returning("*");

  res.status(201).json({ rating: inserted });
};

export const getRatingsForStore = async (req: any, res: any) => {
  const { storeId } = req.params;

  const store = await db("stores").where({ id: storeId }).first();
  if (!store) return res.status(404).json({ error: "Store not found" });

  if (req.user.role !== "admin" && req.user.id !== store.owner_id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const ratings = await db("ratings")
    .where({ store_id: storeId })
    .orderBy("created_at", "desc");

  res.json({ data: ratings });
};
