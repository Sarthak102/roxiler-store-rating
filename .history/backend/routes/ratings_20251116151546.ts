import express from "express";
import { authenticate } from "../middleware/auth";
import {
  submitOrUpdateRating,
  getRatingsForStore,
} from "../controllers/ratingController";

const router = express.Router({ mergeParams: true });

router.post("/:storeId/ratings", authenticate, submitOrUpdateRating);
router.get("/:storeId/ratings", authenticate, getRatingsForStore);

export default router;
