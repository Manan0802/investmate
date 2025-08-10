// --- Imports ---
import React, { useEffect, useState, useMemo, useCallback } from "react";
import userService from "../services/userService";
// Recharts library for creating the trend charts
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from "recharts";
// Icons for a cleaner UI
import { Search, Newspaper, Globe } from 'lucide-react';

// --- Main Page Component ---
const MarketPage = () => {
  // --- State Management ---
  // SYNTAX FIX: Corrected a typo from `_useState` to `= useState`.
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // The active search query
  const [manualSearchQuery, setManualSearchQuery] = useState(""); // The text in the input box
  const [sortMode, setSortMode] = useState("default");
  const [range, setRange] = useState("5d");
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [indices, setIndices] = useState([]);
  const [loadingIndices, setLoadingIndices] = useState(true);
  const [loadingStocks, setLoadingStocks] = useState(true);

  // --- Data Fetching ---
  /**
   * `useCallback` memoizes this function to prevent re-creation on every render.
   * It fetches the initial list of top 50 trending stocks.
   */
  const fetchTrendingStocks = useCallback(async () => {
    setLoadingStocks(true);
    try {
      const stocks = await userService.getTrendingStocks();
      const limited = stocks.slice(0, 50);
      setTrendingStocks(limited);
      setFilteredStocks(limited); // Initially, filtered stocks are the same as trending
    } catch (err) {
      console.error("Error fetching trending stocks:", err);
    } finally {
      setLoadingStocks(false);
    }
  }, []);

  // `useEffect` to run the initial fetch of trending stocks when the component mounts.
  useEffect(() => {
    fetchTrendingStocks();
  }, [fetchTrendingStocks]);

  /**
   * `useEffect` to fetch the historical price data for the currently displayed stocks.
   * This runs whenever the list of trending stocks or the date range (`range`) changes.
   */
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const histories = {};
        // Use Promise.all to fetch histories in parallel for better performance.
        await Promise.all(
          trendingStocks.map(async (stock) => {
            const history = await userService.getStockHistory(stock.symbol, range);
            histories[stock.symbol] = history?.history || [];
          })
        );
        setHistoryData(histories);
      } catch (err) {
        console.error("Error fetching stock history:", err);
      }
    };
    if (trendingStocks.length > 0) {
      fetchHistories();
    }
  }, [trendingStocks, range]);

  /**
   * `useMemo` memoizes the sorting logic. The list is only re-sorted when
   * the sort mode, history data, or the base list of stocks changes.
   */
  useMemo(() => {
    if (searchQuery.trim() !== "") return; // Don't apply sorting to search results

    let result = [...trendingStocks].map((stock) => {
      const history = historyData[stock.symbol] || [];
      const start = history[0];
      const end = history[history.length - 1];
      const percentChange = start && end ? ((end - start) / start) * 100 : stock.percentChange || 0;
      return { ...stock, percentChange };
    });

    switch (sortMode) {
      case "gainers":
        result.sort((a, b) => (b.percentChange || 0) - (a.percentChange || 0));
        break;
      case "losers":
        result.sort((a, b) => (a.percentChange || 0) - (b.percentChange || 0));
        break;
      case "alphabetical":
        result.sort((a, b) => (a.symbol || "").localeCompare(b.symbol || ""));
        break;
      default:
        // For the "default" case (All Stocks), we don't need to apply any sorting.
        break;
    }
    setFilteredStocks(result);
  }, [sortMode, historyData, trendingStocks, searchQuery]);

  /**
   * Handles the search for a specific stock symbol.
   */
  const handleSearchClick = async (e) => {
    e.preventDefault(); // Prevent form submission if inside a form
    const query = manualSearchQuery.trim().toUpperCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredStocks(trendingStocks); // Reset to trending list if search is cleared
      return;
    }
    setLoadingStocks(true);
    try {
      const result = await userService.getPriceData(query);
      if (result) {
        const history = await userService.getStockHistory(query, range);
        const historyArr = history?.history || [];
        const start = historyArr[0];
        const end = historyArr[historyArr.length - 1];
        const percentChange = start && end ? ((end - start) / start) * 100 : 0;

        setFilteredStocks([{
          symbol: query,
          name: query,
          price: result.price || 0,
          percentChange,
        }]);
        setHistoryData((prev) => ({ ...prev, [query]: historyArr }));
      } else {
        setFilteredStocks([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setFilteredStocks([]);
    } finally {
      setLoadingStocks(false);
    }
  };
  
  // `useEffect` to fetch market news when the component mounts.
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const articles = await userService.getMarketNews();
        setNews(Array.isArray(articles) ? articles : []);
      } catch (err) {
        console.error("News fetch error:", err);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  // `useEffect` to fetch global indices when the component mounts.
  useEffect(() => {
    const fetchIndices = async () => {
      setLoadingIndices(true);
      try {
        const res = await userService.getGlobalIndices();
        setIndices(res.length > 0 ? res : []);
      } catch (err) {
        console.error("Indices fetch error:", err);
        setIndices([]);
      } finally {
        setLoadingIndices(false);
      }
    };
    fetchIndices();
  }, []);
  
  // --- Style Definitions ---
  const cardStyle = "bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-lg";
  const inputStyle = "w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-white">Market Dashboard</h1>
        <p className="mt-1 text-slate-400">An overview of trending stocks, news, and global indices.</p>
      </div>

      {/* --- Main Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Stock List --- */}
        <div className="lg:col-span-2">
          <div className={`${cardStyle} flex flex-col h-[820px]`}>
            {/* Search and Filters */}
            <form onSubmit={handleSearchClick} className="flex flex-col sm:flex-row gap-4 mb-6 flex-shrink-0">
              <div className="flex-grow flex items-center gap-2">
                <input
                  type="text"
                  value={manualSearchQuery}
                  onChange={(e) => setManualSearchQuery(e.target.value)}
                  placeholder="Search stock symbol (e.g., TCS.NS)"
                  className={`${inputStyle} h-10`}
                />
                <button type="submit" className="flex-shrink-0 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                  <Search size={18} />
                </button>
              </div>
              {searchQuery.trim() === "" && (
                <div className="flex-shrink-0 flex gap-4">
                  {/* FUNCTIONALITY FIX: Restored "All Stocks" and icons to the dropdown */}
                  <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className={`${inputStyle} h-10`}>
                    <option value="default">📋 All Stocks</option>
                    <option value="gainers">📈 Top Gainers</option>
                    <option value="losers">📉 Top Losers</option>
                    <option value="alphabetical">🔤 A - Z</option>
                  </select>
                  {/* FUNCTIONALITY FIX: Restored "MAX" option to the range selector */}
                  <select value={range} onChange={(e) => setRange(e.target.value)} className={`${inputStyle} h-10`}>
                    <option value="1d">1D</option>
                    <option value="5d">5D</option>
                    <option value="1mo">1M</option>
                    <option value="1y">1Y</option>
                    <option value="5y">5Y</option>
                    <option value="max">MAX</option>
                  </select>
                </div>
              )}
            </form>
            
            {/* Stock Table Container */}
            <div className="flex-grow overflow-y-auto -mr-4 pr-4">
              <table className="min-w-full text-sm">
                <thead className="text-xs text-slate-400 uppercase sticky top-0 bg-slate-800">
                  <tr>
                    <th className="p-3 text-left font-semibold">#</th>
                    <th className="p-3 text-left font-semibold">Stock</th>
                    <th className="p-3 text-right font-semibold">Live Price</th>
                    <th className="p-3 text-right font-semibold">% Change</th>
                    <th className="p-3 text-center font-semibold">Trend ({range})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {loadingStocks ? (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-400">Loading stocks...</td></tr>
                  ) : filteredStocks.length > 0 ? (
                    filteredStocks.map((stock, i) => {
                      const history = historyData[stock.symbol] || [];
                      const chartData = history.map((price, idx) => ({ time: idx, price }));
                      const isUp = stock.percentChange >= 0;
                      const strokeColor = isUp ? "#22c55e" : "#ef4444";

                      return (
                        <tr key={stock.symbol} className="hover:bg-slate-700/50 transition-colors">
                          <td className="p-3 text-slate-400">{i + 1}</td>
                          <td className="p-3 font-medium text-white">{stock.name || stock.symbol}</td>
                          <td className="p-3 text-right text-slate-300">₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className={`p-3 text-right font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>{stock.percentChange?.toFixed(2)}%</td>
                          <td className="p-3 w-32">
                            <div className="h-10">
                              {chartData.length > 1 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={chartData}>
                                    <defs>
                                      <linearGradient id={`color-${isUp ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <YAxis domain={["auto", "auto"]} hide />
                                    {/* FUNCTIONALITY FIX: Added a custom tooltip to format the label */}
                                    <Tooltip 
                                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "0.5rem" }}
                                      labelFormatter={(label) => `Day ${label + 1}`}
                                      formatter={(value) => [value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke={strokeColor} fill={`url(#color-${isUp ? 'up' : 'down'})`} strokeWidth={2} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              ) : <span className="text-slate-500 text-xs">Not Available</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-400">No stocks found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Right Column: Sidebar --- */}
        <div className="lg:col-span-1 space-y-8">
          <div className={`${cardStyle} h-[400px] flex flex-col`}>
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
              <Newspaper className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Market News</h3>
            </div>
            <ul className="space-y-3 text-sm flex-grow overflow-y-auto pr-2">
              {loadingNews ? (
                <p className="text-slate-400">Loading news...</p>
              ) : news.length > 0 ? (
                news.map((item, idx) => (
                  <li key={idx} className="border-b border-slate-700 pb-3">
                    <a href={item.url} target="_blank" rel="noreferrer" className="font-medium text-blue-400 hover:underline">
                      {item.title}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">{item.source}</p>
                  </li>
                ))
              ) : (
                <p className="text-slate-400">No news available.</p>
              )}
            </ul>
          </div>

          <div className={`${cardStyle} h-[400px] flex flex-col`}>
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
              <Globe className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Global Indices</h3>
            </div>
            <ul className="space-y-2 text-sm flex-grow overflow-y-auto pr-2">
              {loadingIndices ? (
                <p className="text-slate-400">Loading indices...</p>
              ) : indices.map((idx, i) => (
                <li key={i} className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="font-medium text-white">{idx.name}</span>
                  <span className={`font-semibold ${idx.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
