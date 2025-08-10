// routes/financial.js
import express from "express";
import {
  getPriceData,
  getTrendingStocks,
  getStockHistory, 
  getGlobalIndices// <-- ✅ Add this
} from "../controllers/financial.js";

const router = express.Router();

router.get("/price/:symbol", getPriceData);
router.get("/trending", getTrendingStocks);
router.get("/history/:symbol", getStockHistory); // ✅ Add this
router.get("/indices", getGlobalIndices);


export default router;
