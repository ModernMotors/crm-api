import express from 'express';
import vehicleController from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get vehicle statistics
router.get('/stats', vehicleController.getVehicleStats);

// Export vehicles to CSV
router.get('/export', vehicleController.exportVehicles);

// Bulk operations
router.post('/bulk/delete', authorize(['super_admin', 'admin']), vehicleController.bulkDeleteVehicles);
router.post('/bulk/update', authorize(['super_admin', 'admin', 'manager']), vehicleController.bulkUpdateVehicles);

// Get all vehicles (accessible to all authenticated users)
router.get('/', vehicleController.getAllVehicles);

// Get vehicle by ID (accessible to all authenticated users)
router.get('/:id', vehicleController.getVehicleById);

// Update vehicle status (admin and manager)
router.patch('/:id/status', authorize(['super_admin', 'admin', 'manager']), vehicleController.updateVehicleStatus);

// Assign owner to vehicle (admin and manager)
router.patch('/:id/owner', authorize(['super_admin', 'admin', 'manager']), vehicleController.assignOwner);

// Create vehicle (admin and manager)
router.post('/', authorize(['super_admin', 'admin', 'manager']), vehicleController.createVehicle);

// Update vehicle (admin and manager)
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), vehicleController.updateVehicle);

// Delete vehicle (admin only)
router.delete('/:id', authorize(['super_admin', 'admin']), vehicleController.deleteVehicle);

export default router;
