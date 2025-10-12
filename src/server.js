import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.log("⚠️  Shutting down server due to unhandled promise rejection");
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
  });
});
