import express from "express";
import {
  submitUrl,
  submitUrlBatch,
  getUrlHistory,
  getUserStats,
  checkIndexingStatus
} from "../controllers/urlController.js";
import { protectUser } from "../middleware/protectUser.js"; // ✅ use your existing middleware

const router = express.Router();

// ✅ All routes are now user-specific
router.post("/submit", protectUser, submitUrl);
router.post("/submit-batch", protectUser, submitUrlBatch);
router.post("/check", protectUser, checkIndexingStatus);
router.get("/history", protectUser, getUrlHistory);
router.get("/stats", protectUser, getUserStats);

export default router;
