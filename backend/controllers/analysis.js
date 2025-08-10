// /controllers/analysis.js
import Investment from '../models/investment.js';

const getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });

    let totalInvested = 0;
    let totalProfitLoss = 0;
    const assetMap = {};

    investments.forEach((inv) => {
      const investedAmount = inv.quantity * inv.buyPrice;
      totalInvested += investedAmount;

      const soldQty = inv.sales.reduce((sum, sale) => sum + sale.unitsSold, 0);
      const remainingQty = inv.quantity - soldQty;

      let totalSellAmount = 0;
      inv.sales.forEach(sale => {
        totalSellAmount += sale.unitsSold * sale.sellPrice;
      });

      const averageBuyPrice = inv.buyPrice;
      const costBasis = (soldQty * averageBuyPrice) + (remainingQty * averageBuyPrice);
      const currentPrice = inv.sales.length > 0 ? inv.sales[inv.sales.length - 1].sellPrice : 0;
      const unrealized = remainingQty * currentPrice;

      const netPL = totalSellAmount + unrealized - costBasis;
      totalProfitLoss += netPL;

      // Count asset type for allocation
      if (!assetMap[inv.assetType]) assetMap[inv.assetType] = 0;
      assetMap[inv.assetType] += investedAmount;
    });

    const assetCount = investments.length;

    res.json({
      totalInvested,
      totalProfitLoss,
      assetCount,
      allocation: assetMap,
    });
  } catch (err) {
    console.error('Error in summary:', err);
    res.status(500).json({ message: 'Failed to fetch portfolio summary' });
  }
};

export { getPortfolioSummary };
