import express from 'express';
import { getNews } from '../controllers/news.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',  getNews);

export default router;