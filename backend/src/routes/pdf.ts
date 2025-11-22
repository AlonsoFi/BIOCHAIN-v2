import express, { Request, Response } from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService";

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

    // Procesar PDF según el diagrama
    const result = await processPDF(req.file);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        studyHash: result.studyHash,
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF procesado correctamente",
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

