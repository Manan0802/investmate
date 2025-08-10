import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Using your user model filename

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for the token in the authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (it's in the format "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token and attach them to the request
      // Exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next function (the controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed'); // Token invalid
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token'); // Token missing
  }
};

export { protect };
