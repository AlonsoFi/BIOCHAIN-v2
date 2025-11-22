import express from "express";
import cors from "cors";
import { clinicalHistoryRouter } from "./routes/clinicalHistory";
import { pdfRouter } from "./routes/pdf";
import { studiesRouter } from "./routes/studies";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/clinical-history", clinicalHistoryRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/studies", studiesRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BioChain Backend API" });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});


