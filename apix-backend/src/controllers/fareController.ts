// src/controllers/fareController.ts
import { Request, Response } from 'express';
import { fareService } from '../services/fareService';
import { FareAnalyzeRequest } from '../types';

export const getRoutes = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: fareService.getRoutes() });
};

export const getAirlines = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: fareService.getAirlines() });
};

export const analyzeFare = async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, airline } = req.body as FareAnalyzeRequest;

  if (!origin || !destination || !airline) {
    res.status(400).json({
      success: false,
      error: 'origin, destination, and airline are required.',
    });
    return;
  }

  if (origin.toUpperCase() === destination.toUpperCase()) {
    res.status(400).json({ success: false, error: 'Origin and destination cannot be the same.' });
    return;
  }

  try {
    const result = await fareService.analyzeFare({ origin, destination, airline });
    res.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error during fare analysis.';
    res.status(404).json({ success: false, error: message });
  }
};

export const getTodayFares = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await fareService.getTodayFares();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch today fares.' });
  }
};
