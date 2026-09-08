// src/controllers/demoController.ts
import { Request, Response } from 'express';
import { runMockScraper } from '../services/scraperService';

export const triggerScraper = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await runMockScraper();
    res.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Scraper failed.';
    res.status(500).json({ success: false, error: message });
  }
};
