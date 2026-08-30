import Helpdesk from '../models/Helpdesk.js';
import Branch from '../models/Branch.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class HelpdeskController {
  async getAllTickets(req, res) {
    try {
      const { branch_id, status, priority, category, assigned_to, date_from, date_to } = req.query;
      
      const where = {};
      
      if (branch_id) {
        where.branch_id = branch_id;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (priority) {
        where.priority = priority;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (assigned_to) {
        where.assigned_to = assigned_to;
      }
      
      if (date_from || date_to) {
        where.created_at = {};
        if (date_from) {
          where.created_at[Op.gte] = date_from;
        }
        if (date_to) {
          where.created_at[Op.lte] = date_to;
        }
      }
      
      const tickets = await Helpdesk.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            association: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: tickets,
        count: tickets.length
      });
    } catch (error) {
      logger.error('Get helpdesk tickets error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      
      const ticket = await Helpdesk.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'address', 'phone']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            association: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }
      
      res.json({
        success: true,
        data: ticket
      });
    } catch (error) {
      logger.error('Get helpdesk ticket error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createTicket(req, res) {
    try {
      const ticketData = req.body;
      ticketData.created_by = req.user.id;
      
      // Generate ticket number if not provided
      if (!ticketData.ticket_number) {
        const prefix = 'TKT';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        ticketData.ticket_number = `${prefix}-${timestamp}-${random}`;
      }
      
      const ticket = await Helpdesk.create(ticketData);
      
      const ticketWithIncludes = await Helpdesk.findByPk(ticket.id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });
      
      logger.info(`Helpdesk ticket created: ${ticket.ticket_number}`);
      
      res.status(201).json({
        success: true,
        data: ticketWithIncludes,
        message: 'Ticket created successfully'
      });
    } catch (error) {
      logger.error('Create helpdesk ticket error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const ticket = await Helpdesk.findByPk(id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }
      
      // Auto-update resolved_at if status is being set to resolved
      if (updateData.status === 'resolved' && ticket.status !== 'resolved') {
        updateData.resolved_at = new Date();
      }
      
      await ticket.update(updateData);
      
      const ticketWithIncludes = await Helpdesk.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            association: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });
      
      logger.info(`Helpdesk ticket updated: ${ticket.ticket_number}`);
      
      res.json({
        success: true,
        data: ticketWithIncludes,
        message: 'Ticket updated successfully'
      });
    } catch (error) {
      logger.error('Update helpdesk ticket error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteTicket(req, res) {
    try {
      const { id } = req.params;
      
      const ticket = await Helpdesk.findByPk(id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }
      
      await ticket.destroy();
      
      logger.info(`Helpdesk ticket deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Ticket deleted successfully'
      });
    } catch (error) {
      logger.error('Delete helpdesk ticket error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async assignTicket(req, res) {
    try {
      const { id } = req.params;
      const { assigned_to } = req.body;
      
      const ticket = await Helpdesk.findByPk(id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }
      
      await ticket.update({ assigned_to });
      
      const ticketWithIncludes = await Helpdesk.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            association: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });
      
      logger.info(`Ticket assigned: ${ticket.ticket_number} to user ${assigned_to}`);
      
      res.json({
        success: true,
        data: ticketWithIncludes,
        message: 'Ticket assigned successfully'
      });
    } catch (error) {
      logger.error('Assign ticket error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new HelpdeskController();
