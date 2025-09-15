import { Router } from 'express';
import { createOffer } from '../controllers/offersController.js';

const router = Router();

router.post('/', createOffer);

export default router;


