// backend/src/server.ts
import app from "./app";
import { config } from "dotenv";
config();

import { ensureInitialAdmin } from "./utils/bootstrapAdmin";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);

  // Fire-and-forget; logs errors if something goes wrong
  ensureInitialAdmin().catch((err) => {
    console.error("Error bootstrapping initial admin:", err);
  });
});
