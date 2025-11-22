import express, { Request, Response } from "express";
import { getFilteredStudies } from "../services/studyService";

const router = express.Router();

/**
 * GET /api/studies/filtered
 * Filtra biomarcadores + metadata anónima y envía al frontend
 * Según el diagrama: Backend filtra y envía datos al Frontend
 */
router.get("/filtered", async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.query;

    if (!ownerAddress || typeof ownerAddress !== "string") {
      return res.status(400).json({
        success: false,
        error: "ownerAddress es requerido",
      });
    }

    // Filtrar biomarcadores + metadata anónima (mock)
    const filteredData = await getFilteredStudies(ownerAddress);

    res.status(200).json({
      success: true,
      message: "Datos filtrados obtenidos correctamente",
      data: filteredData,
    });
  } catch (error) {
    console.error("Error al filtrar estudios:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

/**
 * GET /api/studies/:studyHash
 * Obtiene los biomarcadores y metadata de un estudio específico
 */
router.get("/:studyHash", async (req: Request, res: Response) => {
  try {
    const { studyHash } = req.params;

    const studyData = await getFilteredStudies("", studyHash);

    if (!studyData || studyData.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Estudio no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: studyData[0],
    });
  } catch (error) {
    console.error("Error al obtener estudio:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as studiesRouter };

