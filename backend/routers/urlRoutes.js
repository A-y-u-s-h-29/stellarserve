import express from 'express';


import { checkIndexingStatus, getUrlHistory, getUserStats, submitUrl, submitUrlBatch } from '../controllers.js/urlController.js';
import { protectUser } from '../middleware/protectUser.js';

const router = express.Router();

// FREE Routes - No credits needed
router.post('/submit', protectUser, submitUrl);
router.post('/check', protectUser, checkIndexingStatus);
router.get('/history', protectUser, getUrlHistory);
router.get('/stats', protectUser, getUserStats);
// In routes/urlRoutes.js
router.post('/submit-batch', protectUser, submitUrlBatch);
export default router;