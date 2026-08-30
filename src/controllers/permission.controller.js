import Permission from '../models/Permission.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class PermissionController {
  async getAllPermissions(req, res) {
    try {
      const { category, module, is_active, search } = req.query;
      
      const where = {};
      
      if (category) {
        where.category = category;
      }
      
      if (module) {
        where.module = module;
      }
      
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { name_ar: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const permissions = await Permission.findAll({
        where,
        order: [['category', 'ASC'], ['module', 'ASC'], ['name', 'ASC']]
      });
      
      res.json({
        success: true,
        data: permissions,
        count: permissions.length
      });
    } catch (error) {
      logger.error('Get permissions error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPermissionById(req, res) {
    try {
      const { id } = req.params;
      
      const permission = await Permission.findByPk(id);
      
      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }
      
      res.json({
        success: true,
        data: permission
      });
    } catch (error) {
      logger.error('Get permission error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPermission(req, res) {
    try {
      const permissionData = req.body;
      
      const permission = await Permission.create(permissionData);
      
      logger.info(`Permission created: ${permission.name}`);
      
      res.status(201).json({
        success: true,
        data: permission,
        message: 'Permission created successfully'
      });
    } catch (error) {
      logger.error('Create permission error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const permission = await Permission.findByPk(id);
      
      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }
      
      await permission.update(updateData);
      
      logger.info(`Permission updated: ${permission.name}`);
      
      res.json({
        success: true,
        data: permission,
        message: 'Permission updated successfully'
      });
    } catch (error) {
      logger.error('Update permission error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deletePermission(req, res) {
    try {
      const { id } = req.params;
      
      const permission = await Permission.findByPk(id);
      
      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }
      
      await permission.destroy();
      
      logger.info(`Permission deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Permission deleted successfully'
      });
    } catch (error) {
      logger.error('Delete permission error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new PermissionController();
