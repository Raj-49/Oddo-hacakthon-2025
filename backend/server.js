const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();  

const connectDB = require("./config/databaseConnect"); //? Import database connection utility
const authenticateUser = require("./middlewares/authMiddleware");
const logAction = require("./middlewares/logMiddleware");
const promotionService = require("./services/promotionService"); // For promotion logic
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

connectDB(); //! Initialize MongoDB connection

// Initialize promotion cron jobs after database connection
promotionService.startPromotionCronJob();


// Public routes (no authentication required)
// app.use("/v1/public", require("./routes/public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
