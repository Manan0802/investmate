// index.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables first

import app from "./app.js";
import connectDB from "./config/db.js";

// ✅ Connect to MongoDB
connectDB();

// ✅ Optional: Confirm OpenRouter Key Loaded
console.log('Server is starting with this API Key:', process.env.OPENROUTER_API_KEY);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
