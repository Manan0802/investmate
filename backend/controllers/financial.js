
// controllers/financial.js
import yahooFinance from "yahoo-finance2";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const FX_API_URL = "https://open.er-api.com/v6/latest/USD";

// ✅ Detect Indian stocks (used in getPriceData)
const isIndianStock = (symbol) => {
  const upper = symbol.toUpperCase();
  const knownUS = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA", "NFLX", "META"];
  return !upper.includes(".") && !knownUS.includes(upper);
};

// ✅ GET /api/financials/price/:symbol → Live INR price (for both Indian + Global)
export const getPriceData = async (req, res) => {
  try {
    let { symbol } = req.params;
    symbol = symbol.toUpperCase();

    const yahooSymbol = isIndianStock(symbol) ? `${symbol}.NS` : symbol;

    try {
      const result = await yahooFinance.quote(yahooSymbol);
      if (result?.regularMarketPrice) {
        return res.json({
          symbol: yahooSymbol,
          price: result.regularMarketPrice,
          change: result.regularMarketChangePercent ?? 0,
          currency: result.currency || "INR"
        });
      }
    } catch (err) {
      console.warn(`Yahoo fetch failed for ${yahooSymbol}:`, err.message);
    }

    // 🌐 Global fallback: Use Twelve Data + INR conversion
    const twelveRes = await axios.get(
      `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`
    );

    const usdPrice = parseFloat(twelveRes.data.price);
    if (isNaN(usdPrice)) throw new Error("Invalid USD price from Twelve Data");

    const fxRes = await axios.get(FX_API_URL);
    const usdToInr = fxRes.data.rates?.INR;
    const inrPrice = +(usdPrice * usdToInr).toFixed(2);

    return res.json({
      symbol,
      price: inrPrice,
      change: 0,
      currency: "INR"
    });
  } catch (error) {
    console.error("❌ Error fetching price:", error.message);
    return res.status(404).json({ message: "Failed to fetch price data" });
  }
};

// ✅ Nifty 50 Symbols (no sectors)
const nifty50Symbols = [
  "RELIANCE","TCS", "INFY", "WIPRO", "HCLTECH", "TECHM",
  "HDFCBANK", "ICICIBANK", "AXISBANK", "KOTAKBANK", "SBIN", "INDUSINDBK",
  "ITC", "HINDUNILVR", "NESTLEIND", "TATACONSUM", "BRITANNIA",
  "RELIANCE", "ONGC", "COALINDIA", "BPCL", "NTPC", "POWERGRID",
  "MARUTI", "TATAMOTORS", "HEROMOTOCO", "BAJAJ-AUTO", "M&M", "EICHERMOT",
  "SUNPHARMA", "CIPLA", "DRREDDY", "DIVISLAB", "APOLLOHOSP",
  "JSWSTEEL", "TATASTEEL", "HINDALCO",
  "BAJFINANCE", "BAJAJFINSV", "SBILIFE", "HDFCLIFE",
  "LT", "ADANIPORTS", "ADANIENT", "GRASIM", "UPL",
  "TITAN", "ASIANPAINT", "BAJAJHLDNG", "SHREECEM"
];


// ✅ GET /api/financials/trending → All Nifty 50 INR stocks (live)
export const getTrendingStocks = async (req, res) => {
  try {
    const data = await Promise.all(
      nifty50Symbols.map(async (symbol) => {
        const yahooSymbol = `${symbol}.NS`;

        try {
          const quote = await yahooFinance.quote(yahooSymbol);

          return {
            symbol,
            price: quote?.regularMarketPrice ?? null,
            change: quote?.regularMarketChangePercent ?? 0,
            currency: "INR"
          };
        } catch (err) {
          console.warn(`❌ Failed to fetch ${symbol}:`, err.message);
          return null;
        }
      })
    );

    const cleaned = data.filter(item => item !== null);
    res.json(cleaned);
  } catch (error) {
    console.error("❌ Trending fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch trending stocks" });
  }
};

// ✅ GET /api/financials/history/:symbol?range=1d|5d|1mo|1y|5y|max
export const getStockHistory = async (req, res) => {
  const { symbol } = req.params;
  const { range = "5d" } = req.query;

  try {
    const fullSymbol = symbol.endsWith(".NS") ? symbol : `${symbol}.NS`;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${fullSymbol}?range=${range}&interval=1d`;
    const response = await axios.get(url);

    const result = response.data.chart.result[0];
    const prices = result.indicators?.quote[0]?.close;

    if (!prices || !Array.isArray(prices)) {
      return res.status(404).json({ error: "No sparkline data found" });
    }

    // ✅ Round prices to 1 decimal place
    const rounded = prices.map(p => p && +p.toFixed(1));

    res.json({ history: rounded });
  } catch (err) {
    console.error("❌ Error fetching sparkline data:", err.message);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
};

// ✅ GET /api/financials/indices → Global indices data
export const getGlobalIndices = async (req, res) => {
  const indexSymbols = {
    NIFTY50: "^NSEI",
    SENSEX: "^BSESN",
    "NIFTY BANK": "^NSEBANK",
    "NIFTY IT": "^CNXIT",
    "NIFTY MIDCAP 50": "^NSEMDCP50",
    "NIFTY FMCG": "^CNXFMCG",
    "NIFTY PHARMA": "^CNXPHARMA",
    NASDAQ: "^IXIC",
    DOWJONES: "^DJI",
    SP500: "^GSPC",
    FTSE100: "^FTSE",
    NIKKEI225: "^N225",
    "HANG SENG INDEX": "^HSI",
    "SHANGHAI COMPOSITE": "000001.SS",
    "DAX 30": "^GDAXI",
    "CAC 40": "^FCHI",
    "EURO STOXX 50": "^STOXX50E",
    KOSPI: "^KS11",
    BOVESPA: "^BVSP",
    "TSX Composite": "^GSPTSE"
  };

  try {
    const data = await Promise.all(
      Object.entries(indexSymbols).map(async ([name, symbol]) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          return {
            name,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent ?? 0,
            currency: quote.currency || "USD"
          };
        } catch (err) {
          console.warn(`❌ Failed to fetch index ${name}:`, err.message);
          return null;
        }
      })
    );

    const cleaned = data.filter(item => item !== null);
    res.json(cleaned);
  } catch (error) {
    console.error("❌ Failed to fetch indices:", error.message);
    res.status(500).json({ message: "Failed to fetch indices" });
  }
};
