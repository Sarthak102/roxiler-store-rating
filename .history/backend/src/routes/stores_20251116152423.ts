import express from "express";
import {
  getStores,
  getStoreById,
  createStore,
} from "../../controllers/storeController";
import { authenticate, authorizeRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", getStores);
router.get("/:id", getStoreById);
router.post("/", authenticate, authorizeRole("admin"), createStore);

export default router;
