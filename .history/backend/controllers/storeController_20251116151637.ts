import db from "../db";

export const getStores = async (req: any, res: any) => {
  const { page = 1, limit = 20, q, sort = "name", order = "asc" } = req.query;

  const query = db("stores")
    .select("stores.*")
    .leftJoin("ratings", "stores.id", "ratings.store_id")
    .groupBy("stores.id")
    .count("ratings.id as ratings_count")
    .avg("ratings.rating as avg_rating");

  if (q) {
    query
      .where("stores.name", "ilike", `%${q}%`)
      .orWhere("stores.address", "ilike", `%${q}%`);
  }

  const allowedSort = ["name", "avg_rating", "ratings_count"];
  const validSort = allowedSort.includes(sort) ? sort : "name";

  const stores = await query
    .orderBy(validSort, order)
    .limit(limit)
    .offset((page - 1) * limit);
  res.json({ data: stores });
};

export const getStoreById = async (req: any, res: any) => {
  const { id } = req.params;
  const store = await db("stores").where({ id }).first();

  if (!store) return res.status(404).json({ error: "Store not found" });

  const stats = await db("ratings")
    .where({ store_id: id })
    .avg("rating as avg")
    .count("id as count")
    .first();

  res.json({ store, stats });
};

export const createStore = async (req: any, res: any) => {
  const { name, email, address, owner_id } = req.body;

  const [store] = await db("stores")
    .insert({ name, email, address, owner_id })
    .returning("*");

  res.status(201).json({ store });
};
