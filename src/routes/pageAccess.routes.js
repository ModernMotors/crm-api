import express from 'express';
import pageAccessController from '../controllers/pageAccess.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Read page access — any authenticated user
router.get('/', pageAccessController.getAllPageAccess.bind(pageAccessController));
router.get('/role/:role_id', pageAccessController.getRolePageAccess.bind(pageAccessController));
router.get('/:id', pageAccessController.getPageAccessById.bind(pageAccessController));

// Mutate — admin+
router.post('/', authorize(['super_admin', 'admin']), pageAccessController.createPageAccess.bind(pageAccessController));
router.put('/:id', authorize(['super_admin', 'admin']), pageAccessController.updatePageAccess.bind(pageAccessController));
router.delete('/:id', authorize(['super_admin']), pageAccessController.deletePageAccess.bind(pageAccessController));

export default router;
