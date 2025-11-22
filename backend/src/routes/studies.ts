import express, { Request, Response } from "express";
import { getFilteredStudies } from "../services/studyService";
import { getStudyHashesByOwner } from "../services/sorobanService";
import { validateQuery, validateParams, stellarAddressSchema, studyHashSchema, paginationSchema } from "../utils/validation";
import { z } from "zod";
import { ValidationError, NotFoundError } from "../utils/errors";
import { logInfo, logError } from "../utils/logger";
import { CONSTANTS } from "../constants";

const router = express.Router();

/**
 * GET /api/studies/filtered
 * Filtra biomarcadores + metadata anónima y envía al frontend
 * Según el diagrama: Backend filtra y envía datos al Frontend
 * 
 * Combina datos de:
 * 1. StudyRegistry (blockchain) - study_hashes, timestamp, lab_identifier
 * 2. DB local (mock Postgres) - biomarcadores y metadata anónima
 */
router.get("/filtered", validateQuery(z.object({
  ownerAddress: stellarAddressSchema,
  ...paginationSchema.shape,
})), async (req: Request, res: Response) => {
  try {
    const { ownerAddress, page = CONSTANTS.PAGINATION.DEFAULT_PAGE, limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT } = req.query as any;

    logInfo('Fetching filtered studies', { 
      ownerAddress: ownerAddress.substring(0, 8) + '...',
      page,
      limit 
    });

    // Paso 1: Leer study_hashes desde StudyRegistry (blockchain)
    const blockchainStudies = await getStudyHashesByOwner(ownerAddress);
    
    // Paso 2: Filtrar biomarcadores + metadata anónima desde DB (mock Postgres)
    const dbStudies = await getFilteredStudies(ownerAddress);
    
    // Paso 3: Combinar datos de blockchain + DB
    // Si hay datos de blockchain, usarlos; si no, usar solo DB
    let combinedData = blockchainStudies.length > 0 
      ? blockchainStudies.map(blockchainStudy => {
          // Buscar datos de biomarcadores en DB por studyHash
          const dbStudy = dbStudies.find(s => s.studyHash === blockchainStudy.studyHash);
          return {
            studyHash: blockchainStudy.studyHash,
            laboratory: blockchainStudy.labIdentifier,
            biomarkers: dbStudy?.biomarkers || [],
            timestamp: blockchainStudy.timestamp,
            attestationHash: blockchainStudy.attestationHash || dbStudy?.attestationHash || "",
          };
        })
      : dbStudies; // Si no hay datos de blockchain, usar solo DB

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = combinedData.slice(startIndex, endIndex);
    const total = combinedData.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Datos filtrados obtenidos correctamente",
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logError("Error al filtrar estudios", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/studies/:studyHash
 * Obtiene los biomarcadores y metadata de un estudio específico
 */
router.get("/:studyHash", validateParams(z.object({
  studyHash: studyHashSchema,
})), async (req: Request, res: Response) => {
  try {
    const { studyHash } = req.params;

    const studyData = await getFilteredStudies("", studyHash);

    if (!studyData || studyData.length === 0) {
      throw new NotFoundError('Estudio');
    }

    res.status(200).json({
      success: true,
      data: studyData[0],
    });
  } catch (error) {
    logError("Error al obtener estudio", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

export { router as studiesRouter };

