import express from 'express';
import contactController from '../controllers/contact.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get contact statistics
router.get('/stats', contactController.getContactStats);

// Export contacts to CSV
router.get('/export', contactController.exportContacts);

// Bulk operations
router.post('/bulk/delete', authorize(['super_admin', 'admin']), contactController.bulkDeleteContacts);
router.post('/bulk/update', authorize(['super_admin', 'admin', 'manager']), contactController.bulkUpdateContacts);

// Get all contacts (accessible to all authenticated users)
router.get('/', contactController.getAllContacts);

// Get contact by ID (accessible to all authenticated users)
router.get('/:id', contactController.getContactById);

// Get contact activity (appointments and tickets)
router.get('/:id/activity', contactController.getContactActivity);

// Create contact (all authenticated users)
router.post('/', contactController.createContact);

// Update contact (admin and manager)
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), contactController.updateContact);

// Update contact tags
router.put('/:id/tags', authorize(['super_admin', 'admin', 'manager']), contactController.updateContactTags);

// Add vehicles to contact
router.post('/:id/vehicles', authorize(['super_admin', 'admin', 'manager']), contactController.addVehiclesToContact);

// Remove vehicle from contact
router.delete('/:id/vehicles', authorize(['super_admin', 'admin', 'manager']), contactController.removeVehicleFromContact);

// Delete contact (admin only)
router.delete('/:id', authorize(['super_admin', 'admin']), contactController.deleteContact);

export default router;
