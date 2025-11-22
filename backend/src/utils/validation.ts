/**
 * Utilidades de validación
 */

import { z } from 'zod';
import { CONSTANTS } from '../constants';

/**
 * Valida formato de Stellar address
 */
export const stellarAddressSchema = z.string()
  .regex(CONSTANTS.STELLAR.ADDRESS_REGEX, 'Invalid Stellar address format')
  .length(56, 'Stellar address must be 56 characters');

/**
 * Valida study hash (hex string de 64 caracteres)
 */
export const studyHashSchema = z.string()
  .regex(/^[a-f0-9]{64}$/i, 'Invalid study hash format (must be 64 hex characters)')
  .length(64, 'Study hash must be 64 characters');

/**
 * Valida attestation hash
 */
export const attestationHashSchema = z.string()
  .regex(/^[a-f0-9]{64}$/i, 'Invalid attestation hash format')
  .length(64, 'Attestation hash must be 64 characters');

/**
 * Schema para validar datos de historial clínico
 */
export const clinicalHistorySchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  additionalNotes: z.string().max(1000).optional(),
});

/**
 * Schema para validar compra de BioCredits
 */
export const bioCreditPurchaseSchema = z.object({
  walletAddress: stellarAddressSchema,
  amount: z.number().int().positive().max(100, 'Maximum 100 BioCredits per purchase'),
});

/**
 * Schema para validar filtros de reporte
 */
export const reportFiltersSchema = z.object({
  rows: z.string().optional(),
  columns: z.string().optional(),
  laboratories: z.string().optional(),
  biomarkers: z.string().optional(),
  dateRange: z.string().optional(),
  description: z.string().max(500).optional(),
});

/**
 * Schema para validar paginación
 */
export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => {
    const page = parseInt(val || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }),
  limit: z.string().optional().transform((val) => {
    const limit = parseInt(val || '10', 10);
    if (isNaN(limit) || limit < 1) return 10;
    return Math.min(limit, 100); // Max 100
  }),
});

/**
 * Middleware para validar request body con Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware para validar query params con Zod schema
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware para validar params con Zod schema
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

