import { Router } from 'express';
import { scoreLeads } from '../controllers/scoreController.js';

const router = Router();

router.post('/', scoreLeads);

export default router;


