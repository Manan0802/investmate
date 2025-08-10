import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './passportConfig.js'; // ✅ Load Google Strategy

import userRoutes from './routes/user.js';
import investmentRoutes from './routes/investment.js';
import financialRoutes from './routes/financial.js';
import cryptoRoutes from './routes/crypto.js';
import newsRoutes from './routes/news.js';
import aiRoutes from './routes/ai.js';

const APP = express();

// ✅ Middleware
APP.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true,
}));
APP.use(express.json());

// ✅ Session (for passport to work)
APP.use(session({
  secret: 'your-secret-key', // move to .env for production
  resave: false,
  saveUninitialized: false,
}));

APP.use(passport.initialize());
APP.use(passport.session());

// ✅ Existing routes
APP.use('/api/users', userRoutes);
APP.use('/api/investments', investmentRoutes);
APP.use('/api/financials', financialRoutes);
APP.use('/api/crypto', cryptoRoutes);
APP.use('/api/news', newsRoutes);
APP.use('/api/ai', aiRoutes);

// ✅ Google OAuth Route - Step 1
APP.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google OAuth Callback - Step 2
APP.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173',       // redirect to home on success
    failureRedirect: 'http://localhost:5173/login', // redirect to login on fail
  })
);

// ✅ Optional: Auth check route
APP.get('/auth/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default APP;
