import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import logger from "./config/logger.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/auth", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
