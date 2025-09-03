import axios from "axios";

// --- EDITS START HERE ---
// 1. Get the backend URL from the environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 2. Define API endpoints using the backend URL
const USER_API_URL = `${BACKEND_URL}/api/users/`;
const INVESTMENT_API_URL = `${BACKEND_URL}/api/investments/`;
const FINANCIALS_API_URL = `${BACKEND_URL}/api/financials/`;
const CRYPTO_API_URL = `${BACKEND_URL}/api/crypto/`;
const NEWS_API_URL = `${BACKEND_URL}/api/news/`;
const AI_API_URL = `${BACKEND_URL}/api/ai/`;
// --- EDITS END HERE ---

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// === AUTH ===
const register = async (userData) => {
  const res = await axios.post(USER_API_URL + "register", userData);
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(USER_API_URL + "login", userData);
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const logout = () => localStorage.removeItem("user");

// === PROFILE ===

// ✅ Get current logged-in user profile
const getUserProfile = async (token) => {
  const res = await axios.get(USER_API_URL + "profile", authConfig(token));
  return res.data;
};

// ✅ Change user password using old and new passwords
const changePassword = async (oldPassword, newPassword, token) => {
  const res = await axios.put(
    USER_API_URL + "change-password",
    { oldPassword, newPassword },
    authConfig(token)
  );
  return res.data;
};

// === INVESTMENTS ===
const getInvestments = async (token) => {
  const res = await axios.get(INVESTMENT_API_URL, authConfig(token));
  return res.data;
};

const addInvestment = async (data, token) => {
  const res = await axios.post(INVESTMENT_API_URL, data, authConfig(token));
  return res.data;
};

const updateInvestment = async (id, data, token) => {
  const res = await axios.put(INVESTMENT_API_URL + id, data, authConfig(token));
  return res.data;
};

const deleteInvestment = async (id, token) => {
  const res = await axios.delete(INVESTMENT_API_URL + id, authConfig(token));
  return res.data;
};

const addSale = async (id, saleData, token) => {
  const res = await axios.post(INVESTMENT_API_URL + `${id}/sell`, saleData, authConfig(token));
  return res.data;
};

const deleteSale = async (investmentId, saleId, token) => {
  const res = await axios.delete(INVESTMENT_API_URL + `${investmentId}/sales/${saleId}`, authConfig(token));
  return res.data;
};

// === PRICE DATA ===
const getPriceData = async (symbol, token) => {
  const res = await axios.get(FINANCIALS_API_URL + `price/${symbol}`, authConfig(token));
  return res.data;
};

const getStockPrice = async (symbol, token) => {
  const res = await axios.get(FINANCIALS_API_URL + `price/${symbol}`, authConfig(token));
  return res.data;
};

const getCryptoPrice = async (id, token) => {
  const res = await axios.get(CRYPTO_API_URL + `price/${id}`, authConfig(token));
  return res.data;
};

const getTrendingStocks = async (token) => {
  const res = await axios.get(FINANCIALS_API_URL + "trending", authConfig(token));
  return res.data;
};

// ✅ Fetch stock history (used in Market page trends and chart)
const getStockHistory = async (symbol, range = "5d") => {
  try {
    const res = await axios.get(`${FINANCIALS_API_URL}history/${symbol}?range=${range}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch stock history:", error);
    return { history: [] };
  }
};

// ✅ Public access version of price fetch (for Market page)
const fetchLivePrice = async (symbol) => {
  try {
    const res = await axios.get(`${FINANCIALS_API_URL}price/${symbol}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching live price:", err.message);
    return { price: "N/A" };
  }
};

// ✅ Fetch both price + 5-day trend for search results
const getStockDataBySymbol = async (symbol) => {
  try {
    const priceRes = await axios.get(`${FINANCIALS_API_URL}price/${symbol}`);
    const historyRes = await axios.get(`${FINANCIALS_API_URL}history/${symbol}?range=5d`);
    return {
      price: priceRes.data,
      history: historyRes.data
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

// ✅ Optional: search route (if implemented)
const searchStock = async (query) => {
  try {
    const res = await axios.get(`${FINANCIALS_API_URL}search/${query}`);
    return res.data;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error);
    return null;
  }
};

// ✅ NEW: Global Indices (NIFTY, NASDAQ, etc.)
const getGlobalIndices = async () => {
  try {
    const res = await axios.get(`${FINANCIALS_API_URL}indices`);
    return res.data;
  } catch (error) {
    console.error("Error fetching indices:", error);
    return [];
  }
};

// === AI + NEWS ===
const getAiAnalysis = async (token) => {
  const res = await axios.get(AI_API_URL + "analysis", authConfig(token));
  return res.data;
};

const askAiQuestion = async (type, question, token) => {
  const res = await axios.post(AI_API_URL + "ask", { type, question }, authConfig(token));
  return res.data;
};

// ✅ Public: Get Market News (no auth needed)
const getMarketNews = async () => {
  try {
    const res = await axios.get(NEWS_API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching market news:", error);
    return [];
  }
};

// === EXPORT ALL ===
const userService = {
  register,
  login,
  logout,
  getUserProfile,      // ✅ New
  changePassword,      // ✅ New
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  addSale,
  deleteSale,
  getPriceData,
  getStockPrice,
  getCryptoPrice,
  getTrendingStocks,
  getStockHistory,
  fetchLivePrice,
  getStockDataBySymbol,
  searchStock,
  getAiAnalysis,
  askAiQuestion,
  getMarketNews,
  getGlobalIndices // ✅ Newly added for global indices
};

export default userService;