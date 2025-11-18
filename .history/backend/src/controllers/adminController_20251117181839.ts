// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function getStats(req: Request, res: Response) {
  try {
    const usersCountRow = await db("users")
      .count<{ c: string }>("* as c")
      .first();
    const storesCountRow = await db("stores")
      .count<{ c: string }>("* as c")
      .first();
    const ratingsCountRow = await db("ratings")
      .count<{ c: string }>("* as c")
      .first();

    const users_count = Number(usersCountRow?.c ?? 0);
    const stores_count = Number(storesCountRow?.c ?? 0);
    const ratings_count = Number(ratingsCountRow?.c ?? 0);

    return res.json({ users_count, stores_count, ratings_count });
  } catch (err) {
    console.error("getStats err", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const q = String(req.query.q ?? "").trim();
    const role = String(req.query.role ?? "").trim();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(200, Number(req.query.limit ?? 20));
    const offset = (page - 1) * limit;

    let builder = db("users").select(
      "id",
      "name",
      "email",
      "address",
      "role",
      "created_at"
    );

    if (q) {
      const like = `%${q}%`;
      builder = builder.where(function () {
        this.where("name", "ilike", like)
          .orWhere("email", "ilike", like)
          .orWhere("address", "ilike", like);
      });
    }

    if (role) builder = builder.where({ role });

    const totalRow = await builder
      .clone()
      .count<{ c: string }>("* as c")
      .first();
    const total = Number(totalRow?.c ?? 0);

    const data = await builder
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

    // For store_owner users, compute owner rating (average across stores they own)
    const storeOwnerIds = data
      .filter((u: any) => u.role === "store_owner")
      .map((u: any) => u.id);
    if (storeOwnerIds.length > 0) {
      const ratings = await db("stores")
        .leftJoin("ratings", "stores.id", "ratings.store_id")
        .select("stores.owner_id as owner_id")
        .avg("ratings.rating as avg_rating")
        .whereIn("stores.owner_id", storeOwnerIds)
        .groupBy("stores.owner_id");

      const ratingMap: Record<string, number> = {};
      for (const r of ratings) {
        ratingMap[r.owner_id] = Number(r.avg_rating ?? 0);
      }
      data.forEach((u: any) => {
        if (u.role === "store_owner") u.rating = ratingMap[u.id] ?? null;
      });
    }

    return res.json({ data, total });
  } catch (err) {
    console.error("listUsers err", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = await db("users")
      .select("id", "name", "email", "address", "role", "created_at")
      .where({ id })
      .first();
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "store_owner") {
      const row = await db("stores")
        .leftJoin("ratings", "stores.id", "ratings.store_id")
        .where("stores.owner_id", user.id)
        .avg("ratings.rating as avg_rating")
        .first();
      user.rating = Number(row?.avg_rating ?? null);
    }

    return res.json(user);
  } catch (err) {
    console.error("getUserById err", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function createUserByAdmin(req: Request, res: Response) {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await db("users").where({ email }).first();
    if (existing) return res.status(409).json({ error: "User already exists" });

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    await db("users").insert({
      id,
      name,
      email,
      address: address ?? null,
      role: role ?? "user",
      password_hash,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    const user = await db("users")
      .select("id", "name", "email", "address", "role", "created_at")
      .where({ id })
      .first();
    return res.status(201).json({ user });
  } catch (err) {
    console.error("createUserByAdmin err", err);
    return res.status(500).json({ error: "Server error" });
  }
}
