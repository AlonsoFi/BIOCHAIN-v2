import express, { Request, Response } from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService";
import { addProcessedStudy } from "../services/studyService";

const router = express.Router();

// Configurar multer para almacenar PDFs en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
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
router.post("/upload", upload.single("pdf"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó ningún archivo PDF",
      });
    }

    // Obtener owner_wallet del body o headers
    const ownerWallet = req.body.ownerWallet || req.headers["x-wallet-address"];

    if (!ownerWallet) {
      return res.status(400).json({
        success: false,
        error: "ownerWallet es requerido",
      });
    }

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

    // TODO: Llamar a register_study() en Smart Contract StudyRegistry
    // Por ahora solo logueamos
    console.log("📋 Debería llamar a register_study() en StudyRegistry con:");
    console.log("   - studyHash:", result.data?.studyHash);
    console.log("   - ownerWallet:", ownerWallet);
    console.log("   - timestamp:", Date.now());
    console.log("   - labIdentifier:", result.data?.laboratory);
    console.log("   - attestationHash:", result.data?.attestationHash);

    res.status(200).json({
      success: true,
      message: "PDF procesado correctamente y registrado",
      data: result.data,
    });
  } catch (error) {
    console.error("Error al procesar PDF:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as pdfRouter };

