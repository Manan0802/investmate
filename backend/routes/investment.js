import express from 'express';
import {
  getInvestments, addInvestment, updateInvestment, deleteInvestment, addSale, updateSale, deleteSale
} from '../controllers/investment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for the main investment collection
router.route('/').get(protect, getInvestments).post(protect, addInvestment);

// Routes for a specific investment entry
router.route('/:id').delete(protect, deleteInvestment).put(protect, updateInvestment);

// Route for adding a new sale to an investment
router.route('/:id/sell').post(protect, addSale);

// New, specific routes for updating or deleting a single sale from an investment
router.route('/:investmentId/sales/:saleId').put(protect, updateSale).delete(protect, deleteSale);

export default router;