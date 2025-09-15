import { Router } from 'express';
import { exportResults, getResults } from '../controllers/resultsController.js';

const router = Router();

router.get('/', getResults);

// Optional CSV export
router.get('/export', exportResults);

export default router;


