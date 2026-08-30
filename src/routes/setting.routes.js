import express from 'express';
import settingController from '../controllers/setting.controller.js';
import { validateSetting, validateUpdateSetting, validateBulkUpdate } from '../validators/setting.validator.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - accessible without authentication
router.get('/public', settingController.getPublicSettings);

// Protected routes - require authentication
router.get('/', authenticate, settingController.getAllSettings);
router.get('/category/:category', authenticate, settingController.getSettingsByCategory);
router.get('/:key', authenticate, settingController.getSettingByKey);

// Admin only routes
router.post('/', authenticate, authorize(['super_admin', 'admin']), validateSetting, settingController.createSetting);
router.put('/:key', authenticate, authorize(['super_admin', 'admin']), validateUpdateSetting, settingController.updateSetting);
router.put('/bulk/update', authenticate, authorize(['super_admin', 'admin']), validateBulkUpdate, settingController.bulkUpdateSettings);
router.delete('/:key', authenticate, authorize(['super_admin']), settingController.deleteSetting);
router.post('/:key/reset', authenticate, authorize(['super_admin', 'admin']), settingController.resetSettingToDefault);

export default router;
