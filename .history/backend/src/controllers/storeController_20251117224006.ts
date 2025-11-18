// backend/src/controllers/storeController.ts
import db from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Request, Response } from "express";

function tryDecodeToken(authHeader?: string) {
  if (!authHeader) return null;
  try {
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    return payload?.userId ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/stores
 * returns list of stores with avg_rating, ratings_count
 * and if request contains valid Authorization Bearer token, also includes user_rating
 */
export const getStores = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    q,
    sort = "name",
    order = "asc",
  } = req.query as any;
  const offset = (Number(page) - 1) * Number(limit);

  // Try decode token (optional)
  const authHeader = req.headers.authorization;
  const userId = tryDecodeToken(authHeader);

  // Base query: aggregates per store
  const query = db("stores")
    .select("stores.id", "stores.name", "stores.email", "stores.address")
    .leftJoin("ratings", "stores.id", "ratings.store_id")
    .groupBy("stores.id")
    .count("ratings.id as ratings_count")
    .avg("ratings.rating as avg_rating");

  // If userId present, join user's rating separately using subquery to pick the rating for that user
  if (userId) {
    // Left join to a subquery (ratings by this user) so we can select their rating as user_rating
    query
      .leftJoin(
        db.raw(
          `(SELECT store_id, rating as user_rating FROM ratings WHERE user_id = ?) as ur`,
          [userId]
        ),
        "stores.id",
        "ur.store_id"
      )
      .select(db.raw("MAX(ur.user_rating) as user_rating"));
  } else {
    // No user, user_rating will be null
    query.select(db.raw("NULL::integer as user_rating"));
  }

  if (q) {
    query.where(function () {
      this.where("stores.name", "ilike", `%${q}%`).orWhere(
        "stores.address",
        "ilike",
        `%${q}%`
      );
    });
  }

  const allowedSort = ["name", "avg_rating", "ratings_count"];
  const s = allowedSort.includes(sort) ? sort : "name";

  // If sorting by avg_rating, reference the alias; knex requires raw ordering in that case
  if (s === "avg_rating") {
    query.orderByRaw(`avg_rating ${order === "desc" ? "desc" : "asc"}`);
  } else {
    query.orderBy(s, order === "desc" ? "desc" : "asc");
  }

  // pagination
  const stores = await query.limit(Number(limit)).offset(offset);

  // return payload
  res.json({
    data: stores.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      address: r.address,
      ratings_count: Number(r.ratings_count) || 0,
      avg_rating: r.avg_rating !== null ? Number(r.avg_rating) : null,
      user_rating:
        r.user_rating !== null
          ? r.user_rating !== undefined
            ? Number(r.user_rating)
            : null
          : null,
    })),
  });
};

// export const getStoreById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const store = await db("stores").where({ id }).first();
//   if (!store) return res.status(404).json({ error: "Store not found" });

//   const stats = await db("ratings")
//     .where({ store_id: id })
//     .avg("rating as avg")
//     .count("id as count")
//     .first();

//   res.json({ store, stats });
// };

export const createStore = async (req: Request, res: Response) => {
  const { name, email, address, owner_id } = req.body;
  const [store] = await db("stores")
    .insert({ name, email, address, owner_id })
    .returning("*");
  res.status(201).json({ store });
};

export async function getStoreById(req: any, res: Response) {
  try {
    const id = req.params.id;
    const storeRow = await db("stores")
      .leftJoin("ratings", "stores.id", "ratings.store_id")
      .select(
        "stores.id",
        "stores.name",
        "stores.email",
        "stores.address",
        db.raw("COALESCE(AVG(ratings.rating), 0)::numeric(10,2) as avg_rating"),
        db.raw("COUNT(ratings.id) as ratings_count")
      )
      .where("stores.id", id)
      .groupBy("stores.id")
      .first();

    if (!storeRow) return res.status(404).json({ error: "Store not found" });

    // if user authenticated, fetch user's rating for this store
    const authUserId = req.user?.userId;
    if (authUserId) {
      const ur = await db("ratings")
        .select("rating", "comment")
        .where({ store_id: id, user_id: authUserId })
        .first();
      storeRow.user_rating = ur ? Number(ur.rating) : null;
      storeRow.user_comment = ur ? ur.comment : null;
    }

    return res.json({ store: storeRow });
  } catch (err) {
    console.error("getStoreById err", err);
    return res.status(500).json({ error: "Server error" });
  }
}
