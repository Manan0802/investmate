// /routes/analysisRoutes.js
import express from 'express';
import { getPortfolioSummary } from '../controllers/analysis.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getPortfolioSummary);

export default router;
