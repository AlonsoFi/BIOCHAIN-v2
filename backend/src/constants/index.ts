/**
 * Constantes del proyecto BioChain
 */

export const CONSTANTS = {
  PDF: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: ['application/pdf'],
  },
  PAYMENT: {
    USDC_PER_STUDY: 5,
    BIOCREDIT_COST: 60, // USD
    BIOCREDIT_COST_USDC: 60, // USDC
  },
  RATE_LIMIT: {
    UPLOAD_WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    UPLOAD_MAX: 5, // 5 uploads por ventana
    API_WINDOW_MS: 1 * 60 * 1000, // 1 minuto
    API_MAX: 100, // 100 requests por minuto
  },
  CACHE: {
    BALANCE_TTL: 30 * 1000, // 30 segundos
    STUDIES_TTL: 60 * 1000, // 1 minuto
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  STELLAR: {
    ADDRESS_REGEX: /^G[A-Z0-9]{55}$/,
  },
} as const;

