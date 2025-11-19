// backend/src/utils/bootstrapAdmin.ts
import db from "../db";
import bcrypt from "bcrypt";

export async function ensureInitialAdmin() {
  const email = process.env.INIT_ADMIN_EMAIL;
  const password = process.env.INIT_ADMIN_PASSWORD;
  const name = process.env.INIT_ADMIN_NAME || "Initial Administrator";

  if (!email || !password) {
    console.log(
      "[bootstrapAdmin] INIT_ADMIN_EMAIL or INIT_ADMIN_PASSWORD not set, skipping."
    );
    return;
  }

  try {
    const existing = await db("users").where({ email }).first();
    if (existing) {
      console.log("[bootstrapAdmin] Admin already exists, skipping.");
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    await db("users").insert({
      // id: will be auto-generated if your migration uses default uuid
      name,
      email,
      password_hash: hash,
      role: "admin",
      address: null,
    });

    console.log(
      `[bootstrapAdmin] Admin created with email ${email}. Remember the password!`
    );
  } catch (err) {
    console.error("[bootstrapAdmin] Failed to create admin:", err);
  }
}
