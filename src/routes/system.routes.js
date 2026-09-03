import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import systemController from '../controllers/system.controller.js';

const router = express.Router();

router.get('/status', authenticate, systemController.getSystemStatus);

export default router;
