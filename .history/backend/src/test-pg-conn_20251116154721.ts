// backend/src/test-pg-conn.ts
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/app_db";

  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT 1 as ok");
    console.log("connected ok", res.rows);
    await client.end();
  } catch (err) {
    console.error("pg connection error:", err);
    process.exit(1);
  }
})();
