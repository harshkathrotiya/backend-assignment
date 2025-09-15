import { Router } from 'express';
import multer from 'multer';
import { uploadLeads } from '../controllers/leadsController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), uploadLeads);
export default router;


