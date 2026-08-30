import express from 'express';
import roleController from '../controllers/role.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Viewing roles is available to all authenticated users
router.get('/', roleController.getAllRoles.bind(roleController));
router.get('/:id', roleController.getRoleById.bind(roleController));

// Mutating roles requires admin or super_admin
router.post('/', authorize(['super_admin', 'admin']), roleController.createRole.bind(roleController));
router.put('/:id', authorize(['super_admin', 'admin']), roleController.updateRole.bind(roleController));
router.delete('/:id', authorize(['super_admin']), roleController.deleteRole.bind(roleController));

export default router;
