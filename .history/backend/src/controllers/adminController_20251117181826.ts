// DEV debug version of listUsers - paste into backend/src/controllers/adminController.ts
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
      // use safe, portable LOWER(...) LIKE LOWER(?) to avoid DB-specific 'ilike' issues
      builder = builder.where(function () {
        this.whereRaw("LOWER(name) LIKE LOWER(?)", [like])
          .orWhereRaw("LOWER(email) LIKE LOWER(?)", [like])
          .orWhereRaw("LOWER(address) LIKE LOWER(?)", [like]);
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

    // compute owner rating for store_owner users (if any)
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
  } catch (err: any) {
    console.error("listUsers ERROR:", err);
    // DEV: return stack so frontend / curl can show debug info
    return res
      .status(500)
      .json({ error: err?.message || "Server error", stack: err?.stack });
  }
}
