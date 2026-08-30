import express from 'express';
import helpdeskController from '../controllers/helpdesk.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tickets (accessible to all authenticated users)
router.get('/', helpdeskController.getAllTickets);

// Get ticket by ID (accessible to all authenticated users)
router.get('/:id', helpdeskController.getTicketById);

// Create ticket (all authenticated users)
router.post('/', helpdeskController.createTicket);

// Update ticket (admin and manager)
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), helpdeskController.updateTicket);

// Delete ticket (admin only)
router.delete('/:id', authorize(['super_admin', 'admin']), helpdeskController.deleteTicket);

// Assign ticket (admin and manager)
router.post('/:id/assign', authorize(['super_admin', 'admin', 'manager']), helpdeskController.assignTicket);

export default router;
