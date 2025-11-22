import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logError } from "../utils/logger";
import { env } from "../config/env";

/**
 * Middleware para manejo de errores mejorado
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log del error
  logError('Request error', err, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Error de multer (upload)
  if (err.message === "Solo se permiten archivos PDF") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Error de validación de Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: (err as any).errors,
    });
  }

  // AppError personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Error genérico
  const statusCode = 500;
  res.status(statusCode).json({
    success: false,
    error: "Error interno del servidor",
    message: env.NODE_ENV === "development" ? err.message : undefined,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}


