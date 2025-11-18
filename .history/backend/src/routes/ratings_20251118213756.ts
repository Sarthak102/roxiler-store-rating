import express from "express";
import { authenticate } from "../middleware/auth";
import {
  submitOrUpdateRating,
  getRatingsForStore,
  createOrUpdateRating,
} from "../controllers/ratingController";

const router = express.Router({ mergeParams: true });

router.post("/:storeId/ratings", authenticate, submitOrUpdateRating);
router.get("/:storeId/ratings", authenticate, getRatingsForStore);
router.post("/:id/ratings", authenticate, createOrUpdateRating);

export default router;
// backend/src/routes/ratings.ts
import express from "express";
import { authenticate } from "../middleware/auth";
import {
  createOrUpdateRating,
  getRatingsForStore,
} from "../controllers/ratingController";

const router = express.Router();

// Customer: create or update rating for a store
// POST /api/stores/:id/ratings
router.post("/stores/:id/ratings", authenticate, createOrUpdateRating);

// Admin / Store owner: view all ratings for a store
// GET /api/stores/:storeId/ratings
router.get("/stores/:storeId/ratings", authenticate, getRatingsForStore);

export default router;