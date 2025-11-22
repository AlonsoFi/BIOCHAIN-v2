import express, { Request, Response } from "express";
import { generateReport } from "../services/reportEngine";
import { processPayment } from "../services/paymentOrchestrator";
import { validateBody, validateQuery } from "../utils/validation";
import { z } from "zod";
import { reportFiltersSchema, stellarAddressSchema, paginationSchema } from "../utils/validation";
import { ValidationError, NotFoundError } from "../utils/errors";
import { logInfo, logError } from "../utils/logger";

const router = express.Router();

const generateReportSchema = z.object({
  filters: reportFiltersSchema,
  researcherWallet: stellarAddressSchema,
});

/**
 * POST /api/reports/generate
 * Genera un reporte según los filtros del investigador
 * Según el diagrama: Backend Report Engine (Mock AI)
 */
router.post("/generate", validateBody(generateReportSchema), async (req: Request, res: Response) => {
  try {
    const { filters, researcherWallet } = req.body;

    logInfo('Generating report', { 
      researcherWallet: researcherWallet.substring(0, 8) + '...',
      filters: Object.keys(filters)
    });

    // Paso 1: Generar reporte (Report Engine)
    const report = await generateReport(filters, researcherWallet);

    // Paso 2: Procesar pagos (Payment Orchestrator)
    const paymentResult = await processPayment(
      researcherWallet,
      report.reportId,
      report.usedStudyHashes
    );

    logInfo('Report generated successfully', { 
      reportId: report.reportId,
      studiesUsed: report.usedStudyHashes.length,
      totalUSDC: paymentResult.totalUSDC
    });

    res.status(200).json({
      success: true,
      message: "Reporte generado correctamente",
      data: {
        ...report,
        payment: paymentResult,
      },
    });
  } catch (error) {
    logError("Error al generar reporte", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/reports/:reportId
 * Obtiene un reporte por ID
 */
router.get("/:reportId", async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    logInfo('Fetching report', { reportId });
    
    const { getReportById } = require("../services/reportStorage");
    const report = getReportById(reportId);
    
    if (!report) {
      throw new NotFoundError('Reporte');
    }
    
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logError("Error al obtener reporte", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/reports
 * Obtiene todos los reportes (historial)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { researcherWallet, limit } = req.query;
    
    logInfo('Fetching reports', { 
      researcherWallet: researcherWallet ? (researcherWallet as string).substring(0, 8) + '...' : 'all',
      limit 
    });
    
    const { getReportsByResearcher, getRecentReports } = require("../services/reportStorage");
    
    let reports;
    if (researcherWallet) {
      reports = getReportsByResearcher(researcherWallet as string);
    } else {
      const limitNum = limit ? parseInt(limit as string, 10) : 10;
      reports = getRecentReports(limitNum);
    }
    
    res.json({
      success: true,
      data: reports,
      count: reports.length,
    });
  } catch (error) {
    logError("Error al obtener reportes", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/reports/:reportId/pdf
 * Descarga un reporte como PDF
 */
router.get("/:reportId/pdf", async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    logInfo('Generating PDF for report', { reportId });
    
    const { getReportById } = require("../services/reportStorage");
    const report = getReportById(reportId);
    
    if (!report) {
      throw new NotFoundError('Reporte');
    }
    
    const { generateReportPDF } = require("../services/pdfGenerator");
    const pdfBuffer = await generateReportPDF(report);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reporte_${reportId}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    logError("Error al generar PDF del reporte", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

export { router as reportsRouter };

