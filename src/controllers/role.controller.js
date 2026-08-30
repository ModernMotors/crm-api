import Role from '../models/Role.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class RoleController {
  async getAllRoles(req, res, next) {
    try {
      const { is_active, is_system, search } = req.query;
      const where = {};
      if (is_active !== undefined) where.is_active = is_active === 'true';
      if (is_system !== undefined) where.is_system = is_system === 'true';
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { name_ar: { [Op.iLike]: `%${search}%` } }
        ];
      }
      const roles = await Role.findAll({ where, order: [['level', 'ASC'], ['name', 'ASC']] });
      res.json({ success: true, data: roles, count: roles.length });
    } catch (error) {
      logger.error('Get roles error:', error);
      next(error);
    }
  }

  async getRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
      res.json({ success: true, data: role });
    } catch (error) {
      logger.error('Get role error:', error);
      next(error);
    }
  }

  async createRole(req, res, next) {
    try {
      const roleData = req.body;
      const role = await Role.create(roleData);
      logger.info(`Role created: ${role.name}`);
      res.status(201).json({ success: true, data: role, message: 'Role created successfully' });
    } catch (error) {
      logger.error('Create role error:', error);
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const role = await Role.findByPk(id);
      if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
      if (role.is_system && updateData.name) {
        return res.status(403).json({ success: false, message: 'System role name cannot be changed' });
      }
      await role.update(updateData);
      logger.info(`Role updated: ${role.name}`);
      res.json({ success: true, data: role, message: 'Role updated successfully' });
    } catch (error) {
      logger.error('Update role error:', error);
      next(error);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
      if (role.is_system) return res.status(403).json({ success: false, message: 'System roles cannot be deleted' });
      await role.destroy();
      logger.info(`Role deleted: ${id}`);
      res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
      logger.error('Delete role error:', error);
      next(error);
    }
  }
}

export default new RoleController();
