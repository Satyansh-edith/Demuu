// src/routes/demoRoutes.ts
import { Router } from 'express';
import { triggerScraper } from '../controllers/demoController';

const router = Router();
router.post('/demo/scrape', triggerScraper);

export default router;
