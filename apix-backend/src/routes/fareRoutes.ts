// src/routes/fareRoutes.ts
import { Router } from 'express';
import { analyzeFare, getAirlines, getRoutes, getTodayFares } from '../controllers/fareController';

const router = Router();

router.get('/routes', getRoutes);
router.get('/airlines', getAirlines);
router.get('/fares/today', getTodayFares);
router.post('/fare/analyze', analyzeFare);

export default router;
