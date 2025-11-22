import express from "express";
import cors from "cors";
import { clinicalHistoryRouter } from "./routes/clinicalHistory";
import { pdfRouter } from "./routes/pdf";
import { studiesRouter } from "./routes/studies";
import { biocreditRouter } from "./routes/biocredit";
import { reportsRouter } from "./routes/reports";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { env } from "./config/env";
import { logInfo } from "./utils/logger";
import { AppError } from "./utils/errors";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting general
app.use('/api', apiLimiter);

// Routes
app.use("/api/clinical-history", clinicalHistoryRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/studies", studiesRouter);
app.use("/api/biocredit", biocreditRouter);
app.use("/api/reports", reportsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BioChain Backend API" });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logInfo(`🚀 Backend API running on http://localhost:${PORT}`);
  logInfo(`📋 Health check: http://localhost:${PORT}/health`);
  logInfo(`🌍 Environment: ${env.NODE_ENV}`);
});


