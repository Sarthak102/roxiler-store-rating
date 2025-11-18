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
