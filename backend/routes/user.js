// import express from 'express';//import karayi

// // Import both controller functions
// import { registerUser, loginUser } from '../controllers/user.js';


// const router = express.Router();//new router object

// // Route for register
// router.post('/register', registerUser);// .post se boldia ke bhai jo front end pe aya data toh /register se registeruser function bulane ko
// //routes ka and controllers main  conncetion step is in chai and backend well explained

// // Add the route for login
// router.post('/login', loginUser);

// export default router;//export
import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
} from '../controllers/user.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Google OAuth login (trigger login flow)
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    // On successful login via Google, redirect to frontend dashboard
    res.redirect('http://localhost:5173/dashboard');
  }
);

// ✅ Get current user (for frontend after Google login)
router.get('/auth/google/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// ✅ Logout route (optional)
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/login');
  });
});

// ✅ Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/change-password', protect, changePassword);

export default router;
