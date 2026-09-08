// src/controllers/logController.ts
import { Request, Response } from 'express';
import { logRepository } from '../repositories/logRepository';

export const getLogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const logs = await logRepository.findRecent(50);
    res.json({ success: true, data: logs });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch logs.' });
  }
};
