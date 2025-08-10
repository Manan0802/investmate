// --- Imports ---
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';
// Child Components for displaying data
import PortfolioChart from '../components/PortfolioChart.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import ProfitLossChart from '../components/ProfitLossChart.jsx';
// Icons for a cleaner UI
import { Bot, BarChart3, LineChart } from 'lucide-react';

// --- Constants ---
// Filter options for the dropdowns.
const ALLOCATION_FILTERS = ['Overall', 'Stocks', 'Crypto', 'Real Estate', 'Other'];
const PROFIT_LOSS_FILTERS = ['Overall', 'Stocks', 'Crypto', 'Real Estate', 'Other'];

/**
 * Generates an array of random vibrant colors for the portfolio allocation chart.
 * @param {number} numColors - The number of colors to generate.
 * @returns {string[]} An array of RGBA color strings.
 */
const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (360 / numColors) * i;
    colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
  }
  return colors;
};

// --- Main Page Component ---
function AnalysisPage() {
  // --- State Management ---
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For the main AI analysis
  const [allocationFilter, setAllocationFilter] = useState('Overall');
  const [profitLossFilter, setProfitLossFilter] = useState('Overall');
  
  // State for the "Ask AI" feature
  const [askType, setAskType] = useState('portfolio');
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isAsking, setIsAsking] = useState(false); // For the "Ask AI" button

  // --- Data Fetching ---
  /**
   * `useCallback` memoizes this function to prevent it from being recreated on every render.
   * It fetches the user's investment data from the server.
   */
  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await userService.getInvestments(user.token);
      setInvestments(data);
    } catch (err) {
      console.error('Failed to fetch investments', err);
    }
  }, [user]);

  // `useEffect` hook to call `fetchData` once when the component mounts.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Chart Data Calculation ---
  /**
   * `useMemo` memoizes the allocation chart data. It only recalculates when
   * `investments` or `allocationFilter` changes, improving performance.
   */
  const allocationChartData = useMemo(() => {
    const filtered = allocationFilter === 'Overall'
      ? investments
      : investments.filter(inv => inv.assetType === allocationFilter);

    const data = filtered.reduce((acc, inv) => {
      const key = allocationFilter === 'Overall' ? inv.assetType : inv.assetName;
      const value = (inv.quantity || 0) * (inv.buyPrice || 0);
      acc[key] = (acc[key] || 0) + value;
      return acc;
    }, {});

    const labels = Object.keys(data);
    if (labels.length === 0) return null;

    return {
      labels,
      datasets: [{
        label: 'Amount (₹)',
        data: Object.values(data),
        backgroundColor: generateColors(labels.length),
        borderColor: '#1e293b', // slate-800
        borderWidth: 2,
      }],
    };
  }, [investments, allocationFilter]);

  /**
   * `useMemo` memoizes the profit/loss chart data. It processes sales data
   * to show a cumulative profit/loss over time.
   */
  const profitLossChartData = useMemo(() => {
    const filtered = profitLossFilter === 'Overall'
      ? investments
      : investments.filter(inv => inv.assetType === profitLossFilter);

    const sales = filtered
      .flatMap(inv => (inv.sales || []).map(s => ({ ...s, buyPrice: inv.buyPrice })))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sales.length === 0) return null;

    let cumulative = 0;
    const points = sales.map(s => {
      const profit = s.unitsSold * (s.sellPrice - s.buyPrice);
      cumulative += profit;
      return { date: new Date(s.date).toLocaleDateString('en-IN'), value: cumulative };
    });

    return {
      labels: points.map(p => p.date),
      datasets: [{
        label: 'Cumulative Profit/Loss (₹)',
        data: points.map(p => p.value),
        borderColor: '#22d3ee', // cyan-400
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        tension: 0.3,
        // STYLE FIX: Changed fill from true to false to remove the area under the line.
        fill: false,
      }],
    };
  }, [investments, profitLossFilter]);

  // --- AI Interaction Handlers ---
  /**
   * Fetches a comprehensive AI analysis of the entire portfolio.
   */
  const handleGetAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const data = await userService.getAiAnalysis(user.token);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Failed to get analysis', err);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submits a user-defined question to the AI.
   */
  const handleAskAi = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    setAiAnswer(null);
    try {
      const res = await userService.askAiQuestion(askType, question, user.token);
      setAiAnswer(res?.answer || 'AI responded, but no readable answer was returned.');
    } catch (err) {
      console.error("Ask AI failed:", err);
      setAiAnswer("Failed to get a response from the AI. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };
  
  // --- Style Definitions ---
  const cardStyle = "bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col";
  const inputStyle = "w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-white">AI & Analysis</h1>
        <p className="mt-1 text-slate-400">Unlock data-driven insights for your portfolio.</p>
      </div>

      {/* --- Summary Cards Section --- */}
      {investments.length > 0 && <SummaryCard investments={investments} />}

      {/* --- Main Grid Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- LEFT COLUMN: AI Tools --- */}
        <div className="lg:col-span-1 space-y-8">
          {/* AI Portfolio Analysis Card */}
          <div className={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">AI Portfolio Analysis</h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">Get intelligent insights and suggestions for your entire portfolio.</p>
            <button
              onClick={handleGetAnalysis}
              className="w-full py-2 px-4 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
              disabled={isLoading || investments.length === 0}
            >
              {isLoading ? 'Analyzing...' : 'Get Full Analysis'}
            </button>
            {analysis && (
              <div className="mt-6 text-sm text-slate-300 space-y-3 border-t border-slate-700 pt-4">
                <p><strong className="text-blue-400">Risk Level:</strong> {analysis.riskLevel}</p>
                <p><strong className="text-blue-400">Summary:</strong> {analysis.summary}</p>
                {analysis.InvestmentTip && <p><strong className="text-blue-400">Tip:</strong> {analysis.InvestmentTip}</p>}
                <div>
                  <strong className="text-blue-400">Suggestions:</strong>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-slate-400">
                    {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Ask AI Card */}
          <div className={cardStyle}>
            <h3 className="text-xl font-semibold mb-4 text-white">Ask AI a Question</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Context</label>
                <select value={askType} onChange={(e) => setAskType(e.target.value)} className={inputStyle}>
                  <option value="portfolio">About My Portfolio</option>
                  <option value="general">General Market Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Your Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder="e.g., Should I diversify more?"
                  className={inputStyle}
                />
              </div>
              <button
                onClick={handleAskAi}
                disabled={isAsking || !question.trim()}
                className="w-full py-2 px-4 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isAsking ? 'Thinking...' : 'Ask AI'}
              </button>
              {aiAnswer && (
                <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200">
                  <p className="font-semibold text-blue-400 mb-2">AI Answer:</p>
                  <p className="whitespace-pre-wrap">{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Charts --- */}
        {/* LAYOUT FIX: This column is now a responsive grid to place charts side-by-side on larger screens. */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Allocation Chart Card */}
          <div className={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
               <BarChart3 className="w-6 h-6 text-cyan-400" />
               <h2 className="text-xl font-semibold text-white">Portfolio Allocation</h2>
            </div>
            <select value={allocationFilter} onChange={(e) => setAllocationFilter(e.target.value)} className={`${inputStyle} max-w-xs`}>
              {ALLOCATION_FILTERS.map(opt => <option key={opt} value={opt}>{opt} Allocation</option>)}
            </select>
            <div className="mt-4 flex-grow flex items-center justify-center">
              {allocationChartData ? (
                <PortfolioChart chartData={allocationChartData} />
              ) : (
                <div className="text-center text-slate-500 py-16">No allocation data to display.</div>
              )}
            </div>
          </div>

          {/* Profit/Loss Chart Card */}
          <div className={cardStyle}>
             <div className="flex items-center gap-3 mb-4">
               <LineChart className="w-6 h-6 text-cyan-400" />
               <h2 className="text-xl font-semibold text-white">Profit/Loss Analysis</h2>
            </div>
            <select value={profitLossFilter} onChange={(e) => setProfitLossFilter(e.target.value)} className={`${inputStyle} max-w-xs`}>
              {PROFIT_LOSS_FILTERS.map(opt => <option key={opt} value={opt}>{opt} Realized P/L</option>)}
            </select>
            <div className="mt-4 flex-grow flex items-center justify-center">
              {profitLossChartData ? (
                <ProfitLossChart chartData={profitLossChartData} />
              ) : (
                <div className="text-center text-slate-500 py-16">No sales data to analyze.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
