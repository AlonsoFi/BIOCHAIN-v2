import express, { Request, Response } from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService";
import { addProcessedStudy } from "../services/studyService";
import { registerStudy } from "../services/sorobanService";
import { uploadLimiter } from "../middleware/rateLimiter";
import { stellarAddressSchema } from "../utils/validation";
import { ValidationError } from "../utils/errors";
import { logInfo, logError } from "../utils/logger";
import { CONSTANTS } from "../constants";

const router = express.Router();

// Configurar multer para almacenar PDFs en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: CONSTANTS.PDF.MAX_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (CONSTANTS.PDF.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF"));
    }
  },
});

/**
 * POST /api/pdf/upload
 * Procesa el PDF del usuario según el flujo del diagrama
 */
router.post("/upload", uploadLimiter, upload.single("pdf"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new ValidationError("No se proporcionó ningún archivo PDF");
    }

    // Obtener owner_wallet del body o headers
    const ownerWallet = req.body.ownerWallet || req.headers["x-wallet-address"];

    if (!ownerWallet) {
      throw new ValidationError("ownerWallet es requerido");
    }

    // Validar formato de Stellar address
    try {
      stellarAddressSchema.parse(ownerWallet);
    } catch (error) {
      throw new ValidationError("Formato de wallet address inválido");
    }

    logInfo('Processing PDF upload', { 
      filename: req.file.originalname,
      size: req.file.size,
      ownerWallet: ownerWallet.substring(0, 8) + '...'
    });

    // Procesar PDF según el diagrama
    const result = await processPDF(req.file);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        studyHash: result.studyHash,
      });
    }

    // Guardar estudio procesado en la base de datos (mock)
    if (result.data) {
      await addProcessedStudy({
        studyHash: result.data.studyHash,
        ownerAddress: ownerWallet as string,
        laboratory: result.data.laboratory,
        biomarkers: result.data.biomarkers,
        attestationHash: result.data.attestationHash,
      });
    }

    // Llamar a register_study() en Smart Contract StudyRegistry
    if (result.data) {
      const timestamp = Math.floor(Date.now() / 1000); // Timestamp en segundos
      const labIdentifier = result.data.laboratory.replace(/\s+/g, "_").toUpperCase(); // Convertir a formato válido
      
      const registerResult = await registerStudy(
        ownerWallet as string,
        result.data.studyHash,
        timestamp,
        labIdentifier,
        result.data.attestationHash
      );

      if (!registerResult.success) {
        logError("Error al registrar estudio en blockchain", new Error(registerResult.error || 'Unknown error'));
        // No fallamos la request, solo logueamos el error
        // El estudio ya está guardado en la DB
      } else {
        logInfo("Estudio registrado en blockchain", { txHash: registerResult.txHash });
      }
    }

    logInfo('PDF processed successfully', { studyHash: result.data?.studyHash?.substring(0, 16) + '...' });

    res.status(200).json({
      success: true,
      message: "PDF procesado correctamente y registrado",
      data: result.data,
    });
  } catch (error) {
    logError("Error al procesar PDF", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

export { router as pdfRouter };

