import express from 'express';
import branchController from '../controllers/branch.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateId, validatePagination } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/branches — list all branches with optional filters & pagination
router.get('/', validatePagination, branchController.getAllBranches);

// GET /api/branches/:id — single branch
router.get('/:id', validateId, branchController.getBranchById);

// GET /api/branches/:id/stats — employee & vehicle counts for a branch
router.get('/:id/stats', validateId, branchController.getBranchStats);

// POST /api/branches — create (admin+)
router.post('/', authorize(['super_admin', 'admin']), branchController.createBranch);

// PUT /api/branches/:id — update (admin+)
router.put('/:id', validateId, authorize(['super_admin', 'admin']), branchController.updateBranch);

// DELETE /api/branches/:id — soft delete (super_admin only)
router.delete('/:id', validateId, authorize(['super_admin']), branchController.deleteBranch);

export default router;
