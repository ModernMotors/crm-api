import MailGroup from '../models/MailGroup.js';
import Company from '../models/Company.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class MailGroupController {
  async getAllMailGroups(req, res) {
    try {
      const { company_id, category, is_active, search } = req.query;
      
      const where = {};
      
      if (company_id) {
        where.company_id = company_id;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }
      
      if (search) {
        where[Op.or] = [
          { group_name: { [Op.iLike]: `%${search}%` } },
          { group_description: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const mailGroups = await MailGroup.findAll({
        where,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: mailGroups,
        count: mailGroups.length
      });
    } catch (error) {
      logger.error('Get mail groups error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMailGroupById(req, res) {
    try {
      const { id } = req.params;
      
      const mailGroup = await MailGroup.findByPk(id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
      
      if (!mailGroup) {
        return res.status(404).json({
          success: false,
          message: 'Mail group not found'
        });
      }
      
      res.json({
        success: true,
        data: mailGroup
      });
    } catch (error) {
      logger.error('Get mail group error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createMailGroup(req, res) {
    try {
      const mailGroupData = req.body;
      
      const mailGroup = await MailGroup.create(mailGroupData);
      
      logger.info(`Mail group created: ${mailGroup.group_name}`);
      
      res.status(201).json({
        success: true,
        data: mailGroup,
        message: 'Mail group created successfully'
      });
    } catch (error) {
      logger.error('Create mail group error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateMailGroup(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const mailGroup = await MailGroup.findByPk(id);
      
      if (!mailGroup) {
        return res.status(404).json({
          success: false,
          message: 'Mail group not found'
        });
      }
      
      await mailGroup.update(updateData);
      
      logger.info(`Mail group updated: ${mailGroup.group_name}`);
      
      res.json({
        success: true,
        data: mailGroup,
        message: 'Mail group updated successfully'
      });
    } catch (error) {
      logger.error('Update mail group error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteMailGroup(req, res) {
    try {
      const { id } = req.params;
      
      const mailGroup = await MailGroup.findByPk(id);
      
      if (!mailGroup) {
        return res.status(404).json({
          success: false,
          message: 'Mail group not found'
        });
      }
      
      await mailGroup.destroy();
      
      logger.info(`Mail group deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Mail group deleted successfully'
      });
    } catch (error) {
      logger.error('Delete mail group error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new MailGroupController();
