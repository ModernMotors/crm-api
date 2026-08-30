import express from 'express';
import appointmentController from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all appointments (accessible to all authenticated users)
router.get('/', appointmentController.getAllAppointments);

// Get appointment by ID (accessible to all authenticated users)
router.get('/:id', appointmentController.getAppointmentById);

// Create appointment (all authenticated users)
router.post('/', appointmentController.createAppointment);

// Update appointment (admin and manager)
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), appointmentController.updateAppointment);

// Delete appointment (admin only)
router.delete('/:id', authorize(['super_admin', 'admin']), appointmentController.deleteAppointment);

export default router;
