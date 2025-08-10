// --- Imports ---
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import InvestmentsPage from './pages/InvestmentsPage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import UserProfile from './pages/UserProfile.jsx';

/**
 * The main App component serves as the root of the application.
 * It sets up the overall layout and routing for the permanent dark theme.
 */
function App() {
  return (
    // This container sets the dark background for the entire application.
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans">
      <Header />

      {/* --- Main Content Area --- */}
      {/* LAYOUT FIX: Removed `max-w-7xl` and `mx-auto` to allow the content
          to fill the entire width of the screen, removing the side margins. 
          The padding (`px-4` etc.) is kept to prevent content from touching the screen edges. */}
      <main className="flex-grow w-full px-4 sm:px-6 md:px-8 py-6">
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/investments"
            element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>}
          />
          <Route
            path="/analysis"
            element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>}
          />
          <Route
            path="/market"
            element={<ProtectedRoute><MarketPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;