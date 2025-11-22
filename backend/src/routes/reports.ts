import express, { Request, Response } from "express";
import { generateReport } from "../services/reportEngine";
import { processPayment } from "../services/paymentOrchestrator";

const router = express.Router();

/**
 * POST /api/reports/generate
 * Genera un reporte según los filtros del investigador
 * Según el diagrama: Backend Report Engine (Mock AI)
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { filters, researcherWallet } = req.body;

    if (!researcherWallet) {
      return res.status(400).json({
        success: false,
        error: "researcherWallet es requerido",
      });
    }

    // Paso 1: Generar reporte (Report Engine)
    const report = await generateReport(filters, researcherWallet);

    // Paso 2: Procesar pagos (Payment Orchestrator)
    const paymentResult = await processPayment(
      researcherWallet,
      report.reportId,
      report.usedStudyHashes
    );

    res.status(200).json({
      success: true,
      message: "Reporte generado correctamente",
      data: {
        ...report,
        payment: paymentResult,
      },
    });
  } catch (error: any) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor",
    });
  }
});

/**
 * GET /api/reports/:reportId
 * Obtiene un reporte por ID
 */
router.get("/:reportId", async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    // Por ahora retornamos mock
    res.json({
      success: true,
      data: {
        reportId,
        message: "Reporte obtenido (mock)",
      },
    });
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as reportsRouter };

