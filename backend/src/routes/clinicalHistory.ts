import express, { Request, Response } from "express";
import { saveClinicalHistory } from "../services/clinicalHistoryService";
import { validateBody } from "../utils/validation";
import { clinicalHistorySchema } from "../utils/validation";
import { logInfo, logError } from "../utils/logger";

const router = express.Router();

/**
 * POST /api/clinical-history
 * Guarda el historial clínico en la base de datos (mock)
 */
router.post("/", validateBody(clinicalHistorySchema), async (req: Request, res: Response) => {
  try {
    const clinicalHistory = req.body;

    logInfo('Saving clinical history', { fullName: clinicalHistory.fullName });

    // Guardar en DB (mock)
    const savedHistory = await saveClinicalHistory(clinicalHistory);

    res.status(201).json({
      success: true,
      message: "Historial clínico guardado correctamente",
      data: savedHistory,
    });
  } catch (error) {
    logError("Error al guardar historial clínico", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/clinical-history/:id
 * Obtiene un historial clínico por ID (mock)
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Por ahora retornamos mock data
    res.json({
      success: true,
      data: {
        id,
        message: "Historial clínico obtenido (mock)",
      },
    });
  } catch (error) {
    logError("Error al obtener historial clínico", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

export { router as clinicalHistoryRouter };


