import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";
import storeOwnerRoutes from "./routes/storeOwner";

import authRoutes from "./routes/auth";
import storeRoutes from "./routes/stores";
import ratingRoutes from "./routes/ratings";
import adminRoutes from "./routes/admin";
import express, { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/admin", adminRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/stores", ratingRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;
