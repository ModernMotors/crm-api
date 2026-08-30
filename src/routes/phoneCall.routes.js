import express from 'express';
import phoneCallController from '../controllers/phoneCall.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all phone calls (accessible to all authenticated users)
router.get('/', phoneCallController.getAllPhoneCalls);

// Get phone call by ID (accessible to all authenticated users)
router.get('/:id', phoneCallController.getPhoneCallById);

// Create phone call (all authenticated users)
router.post('/', phoneCallController.createPhoneCall);

// Update phone call (all authenticated users)
router.put('/:id', phoneCallController.updatePhoneCall);

// Delete phone call (admin only)
router.delete('/:id', authorize(['super_admin', 'admin']), phoneCallController.deletePhoneCall);

export default router;
