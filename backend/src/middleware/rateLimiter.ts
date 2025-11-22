/**
 * Rate limiting middleware
 */

import rateLimit from 'express-rate-limit';
import { CONSTANTS } from '../constants';
import { RateLimitError } from '../utils/errors';

/**
 * Rate limiter para upload de PDFs
 */
export const uploadLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.UPLOAD_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT.UPLOAD_MAX,
  message: 'Too many PDF uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new RateLimitError('Too many PDF uploads. Please wait before uploading again.');
  },
});

/**
 * Rate limiter general para API
 */
export const apiLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.API_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT.API_MAX,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

