import express, { Request, Response } from "express";
import { saveClinicalHistory } from "../services/clinicalHistoryService";

const router = express.Router();

/**
 * POST /api/clinical-history
 * Guarda el historial clínico en la base de datos (mock)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const clinicalHistory = req.body;

    // Validar datos básicos
    if (!clinicalHistory.fullName || !clinicalHistory.dateOfBirth) {
      return res.status(400).json({
        success: false,
        error: "Campos requeridos: fullName, dateOfBirth",
      });
    }

    // Guardar en DB (mock)
    const savedHistory = await saveClinicalHistory(clinicalHistory);

    res.status(201).json({
      success: true,
      message: "Historial clínico guardado correctamente",
      data: savedHistory,
    });
  } catch (error) {
    console.error("Error al guardar historial clínico:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
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
    console.error("Error al obtener historial clínico:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as clinicalHistoryRouter };


