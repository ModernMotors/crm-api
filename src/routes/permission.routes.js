import express from 'express';
import permissionController from '../controllers/permission.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Read permissions — available to all authenticated users
router.get('/', permissionController.getAllPermissions.bind(permissionController));
router.get('/:id', permissionController.getPermissionById.bind(permissionController));

// Mutating permissions — super_admin only (permission catalog is system-level)
router.post('/', authorize(['super_admin']), permissionController.createPermission.bind(permissionController));
router.put('/:id', authorize(['super_admin']), permissionController.updatePermission.bind(permissionController));
router.delete('/:id', authorize(['super_admin']), permissionController.deletePermission.bind(permissionController));

export default router;
