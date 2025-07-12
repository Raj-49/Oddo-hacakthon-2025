const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const guestMiddleware = require("./middlewares/guestMiddleware");
const authorize = require("./middlewares/authorize");
const logAction = require("./middlewares/logMiddleware");
const promotionService = require("./services/promotionService");// For promotion logic
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(logAction);
app.use(guestMiddleware); // Add guest middleware for unauthenticated users

// Connect to MongoDB
connectDB(); //! Initialize MongoDB connection

// Initialize promotion cron jobs after database connection
promotionService.startPromotionCronJob();

// Auth routes (public)
app.use('/api/auth', require('./routes/auth'));

// Public routes with guest access
app.use('/api/questions', guestMiddleware, require('./routes/questions'));
app.use('/api/answers', guestMiddleware, require('./routes/answers'));

// Protected routes
app.use('/api/admin', guestMiddleware, authorize('admin'), require('./routes/admin'));
app.use('/api/user', guestMiddleware, authorize('user', 'admin'), require('./routes/user'));

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to Odoo Hackathon 2025 API - Server is Running! 🚀');
});

app.listen(port, () => {
  console.log('=================================');
  console.log('🚀 Server is up and running!');
  console.log(`📡 URL: http://localhost:${port}`);
  console.log('=================================');
});
