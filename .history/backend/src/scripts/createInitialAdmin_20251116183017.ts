import bcrypt from "bcrypt";
import db from "../db";

async function run() {
  const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
  const plain = process.env.INIT_ADMIN_PASSWORD || "Admin!2345";

  const exists = await db("users").where({ email }).first();
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }
  const hash = await bcrypt.hash(plain, 10);
  const [user] = await db("users")
    .insert({
      name: "Initial Administrator",
      email,
      password_hash: hash,
      role: "admin",
    })
    .returning("*");

  console.log("Created admin", user.id, user.email);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
