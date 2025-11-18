import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";

import authRoutes from "./routes/auth";
import storeRoutes from "./routes/stores";
import ratingRoutes from "./routes/ratings";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/stores", ratingRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

// global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;