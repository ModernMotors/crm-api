import PageAccess from '../models/PageAccess.js';
import Role from '../models/Role.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class PageAccessController {
  async getAllPageAccess(req, res, next) {
    try {
      const { role_id, page, search } = req.query;
      const where = {};
      if (role_id) where.role_id = role_id;
      if (page) where.page = page;
      if (search) {
        where[Op.or] = [
          { page: { [Op.iLike]: `%${search}%` } },
          { page_name: { [Op.iLike]: `%${search}%` } }
        ];
      }
      const pageAccess = await PageAccess.findAll({
        where,
        include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
        order: [['page', 'ASC']]
      });
      res.json({ success: true, data: pageAccess, count: pageAccess.length });
    } catch (error) {
      logger.error('Get page access error:', error);
      next(error);
    }
  }

  async getPageAccessById(req, res) {
    try {
      const { id } = req.params;
      
      const pageAccess = await PageAccess.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name']
          }
        ]
      });
      
      if (!pageAccess) {
        return res.status(404).json({
          success: false,
          message: 'Page access not found'
        });
      }
      
      res.json({
        success: true,
        data: pageAccess
      });
    } catch (error) {
      logger.error('Get page access error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPageAccess(req, res) {
    try {
      const pageAccessData = req.body;
      
      const pageAccess = await PageAccess.create(pageAccessData);
      
      logger.info(`Page access created: ${pageAccess.page} for role ${pageAccess.role_id}`);
      
      res.status(201).json({
        success: true,
        data: pageAccess,
        message: 'Page access created successfully'
      });
    } catch (error) {
      logger.error('Create page access error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePageAccess(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const pageAccess = await PageAccess.findByPk(id);
      
      if (!pageAccess) {
        return res.status(404).json({
          success: false,
          message: 'Page access not found'
        });
      }
      
      await pageAccess.update(updateData);
      
      logger.info(`Page access updated: ${pageAccess.page} for role ${pageAccess.role_id}`);
      
      res.json({
        success: true,
        data: pageAccess,
        message: 'Page access updated successfully'
      });
    } catch (error) {
      logger.error('Update page access error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deletePageAccess(req, res) {
    try {
      const { id } = req.params;
      
      const pageAccess = await PageAccess.findByPk(id);
      
      if (!pageAccess) {
        return res.status(404).json({
          success: false,
          message: 'Page access not found'
        });
      }
      
      await pageAccess.destroy();
      
      logger.info(`Page access deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Page access deleted successfully'
      });
    } catch (error) {
      logger.error('Delete page access error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRolePageAccess(req, res) {
    try {
      const { role_id } = req.params;
      
      const pageAccess = await PageAccess.findAll({
        where: { role_id },
        order: [['page', 'ASC']]
      });
      
      res.json({
        success: true,
        data: pageAccess,
        count: pageAccess.length
      });
    } catch (error) {
      logger.error('Get role page access error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new PageAccessController();
