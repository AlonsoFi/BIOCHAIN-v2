import { Request, Response, NextFunction } from "express";

/**
 * Middleware para manejo de errores
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  // Error de multer (upload)
  if (err.message === "Solo se permiten archivos PDF") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}


