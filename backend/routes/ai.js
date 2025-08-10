import express from 'express';
import { analyzePortfolio, askAi } from '../controllers/ai.js'; // ✅ lowercase 'askAi'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analysis', protect, analyzePortfolio);

// ✅ New route to ask questions
router.post('/ask', protect, askAi);

export default router;
