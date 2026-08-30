import PhoneCall from '../models/PhoneCall.js';
import Branch from '../models/Branch.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class PhoneCallController {
  async getAllPhoneCalls(req, res) {
    try {
      const { branch_id, contact_id, direction, status, purpose, date_from, date_to } = req.query;
      
      const where = {};
      
      if (branch_id) {
        where.branch_id = branch_id;
      }
      
      if (contact_id) {
        where.contact_id = contact_id;
      }
      
      if (direction) {
        where.direction = direction;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (purpose) {
        where.purpose = purpose;
      }
      
      if (date_from || date_to) {
        where.call_date = {};
        if (date_from) {
          where.call_date[Op.gte] = date_from;
        }
        if (date_to) {
          where.call_date[Op.lte] = date_to;
        }
      }
      
      const phoneCalls = await PhoneCall.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['call_date', 'DESC']]
      });
      
      res.json({
        success: true,
        data: phoneCalls,
        count: phoneCalls.length
      });
    } catch (error) {
      logger.error('Get phone calls error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPhoneCallById(req, res) {
    try {
      const { id } = req.params;
      
      const phoneCall = await PhoneCall.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'address', 'phone']
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });
      
      if (!phoneCall) {
        return res.status(404).json({
          success: false,
          message: 'Phone call not found'
        });
      }
      
      res.json({
        success: true,
        data: phoneCall
      });
    } catch (error) {
      logger.error('Get phone call error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPhoneCall(req, res) {
    try {
      const phoneCallData = req.body;
      phoneCallData.created_by = req.user.id;
      
      const phoneCall = await PhoneCall.create(phoneCallData);
      
      const phoneCallWithIncludes = await PhoneCall.findByPk(phoneCall.id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      
      logger.info(`Phone call created: ${phoneCall.id}`);
      
      res.status(201).json({
        success: true,
        data: phoneCallWithIncludes,
        message: 'Phone call created successfully'
      });
    } catch (error) {
      logger.error('Create phone call error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePhoneCall(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const phoneCall = await PhoneCall.findByPk(id);
      
      if (!phoneCall) {
        return res.status(404).json({
          success: false,
          message: 'Phone call not found'
        });
      }
      
      await phoneCall.update(updateData);
      
      const phoneCallWithIncludes = await PhoneCall.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      
      logger.info(`Phone call updated: ${id}`);
      
      res.json({
        success: true,
        data: phoneCallWithIncludes,
        message: 'Phone call updated successfully'
      });
    } catch (error) {
      logger.error('Update phone call error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deletePhoneCall(req, res) {
    try {
      const { id } = req.params;
      
      const phoneCall = await PhoneCall.findByPk(id);
      
      if (!phoneCall) {
        return res.status(404).json({
          success: false,
          message: 'Phone call not found'
        });
      }
      
      await phoneCall.destroy();
      
      logger.info(`Phone call deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Phone call deleted successfully'
      });
    } catch (error) {
      logger.error('Delete phone call error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new PhoneCallController();
