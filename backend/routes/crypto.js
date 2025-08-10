import express from 'express';
import { getCryptoPrices } from '../controllers/crypto.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/price/:ids', protect, getCryptoPrices);
export default router;