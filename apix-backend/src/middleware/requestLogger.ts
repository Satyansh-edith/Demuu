// src/middleware/requestLogger.ts
// Logs every API request to MongoDB ApiLog collection

import { Request, Response, NextFunction } from 'express';
import { logRepository } from '../repositories/logRepository';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    // Don't log health checks or log fetches (would create infinite loops)
    if (req.path === '/api/v1/health' || req.path === '/api/v1/logs') {
      next();
      return;
    }
    logRepository
      .create({
        timestamp: new Date(),
        method: req.method,
        endpoint: req.path,
        statusCode: res.statusCode,
        responseTime,
        message: `${req.method} ${req.path} → ${res.statusCode}`,
      })
      .catch(() => {/* swallow log errors */});
  });
  next();
};
