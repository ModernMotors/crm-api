import Branch from '../models/Branch.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Vehicle from '../models/Vehicle.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class BranchController {
  async getAllBranches(req, res, next) {
    try {
      const { status, city, search } = req.query;
      const { page = 1, limit = 50, offset = 0 } = req.pagination || {};

      const where = {};

      if (status) {
        where.status = status;
      }

      if (city) {
        where.city = { [Op.iLike]: `%${city}%` };
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: branches } = await Branch.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'name_ar', 'code'],
          },
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });

      res.json({
        success: true,
        data: branches,
        count,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error('Get branches error:', error);
      next(error);
    }
  }

  async getBranchById(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id, {
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'name_ar', 'code'],
          },
        ],
      });

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }

      res.json({
        success: true,
        data: branch,
      });
    } catch (error) {
      logger.error('Get branch error:', error);
      next(error);
    }
  }

  async getBranchStats(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id);
      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }

      const [totalEmployees, activeEmployees, totalVehicles, availableVehicles] =
        await Promise.all([
          Employee.count({ where: { branch_id: id } }),
          Employee.count({ where: { branch_id: id, status: 'active' } }),
          Vehicle.count({ where: { branch_id: id } }),
          Vehicle.count({ where: { branch_id: id, status: 'available' } }),
        ]);

      res.json({
        success: true,
        data: {
          branchId: id,
          employees: {
            total: totalEmployees,
            active: activeEmployees,
            inactive: totalEmployees - activeEmployees,
          },
          vehicles: {
            total: totalVehicles,
            available: availableVehicles,
            unavailable: totalVehicles - availableVehicles,
          },
        },
      });
    } catch (error) {
      logger.error('Get branch stats error:', error);
      next(error);
    }
  }

  async createBranch(req, res, next) {
    try {
      const {
        name,
        code,
        address,
        city,
        country,
        phone,
        email,
        manager_id,
        company_id,
        status,
        is_main_branch,
        branch_type,
        working_hours,
        opening_hours,
        latitude,
        longitude,
      } = req.body;

      if (!name || !code) {
        return res.status(400).json({
          success: false,
          message: 'Branch name and code are required',
        });
      }

      const branch = await Branch.create({
        name,
        code: code.toUpperCase(),
        address,
        city,
        country,
        phone,
        email,
        manager_id,
        company_id,
        status: status || 'active',
        is_main_branch: is_main_branch ?? false,
        branch_type: branch_type || 'showroom',
        working_hours,
        opening_hours,
        latitude,
        longitude,
      });

      // Re-fetch with associations
      const created = await Branch.findByPk(branch.id, {
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'name_ar', 'code'],
          },
        ],
      });

      logger.info(`Branch created: ${branch.name}`);

      res.status(201).json({
        success: true,
        data: created,
        message: 'Branch created successfully',
      });
    } catch (error) {
      logger.error('Create branch error:', error);
      next(error);
    }
  }

  async updateBranch(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id);
      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }

      const allowedFields = [
        'name',
        'code',
        'address',
        'city',
        'country',
        'phone',
        'email',
        'manager_id',
        'company_id',
        'status',
        'is_main_branch',
        'branch_type',
        'working_hours',
        'opening_hours',
        'latitude',
        'longitude',
      ];

      const updateData = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }

      await branch.update(updateData);

      // Re-fetch with associations
      const updated = await Branch.findByPk(id, {
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'name_ar', 'code'],
          },
        ],
      });

      logger.info(`Branch updated: ${branch.name}`);

      res.json({
        success: true,
        data: updated,
        message: 'Branch updated successfully',
      });
    } catch (error) {
      logger.error('Update branch error:', error);
      next(error);
    }
  }

  async deleteBranch(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id);
      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }

      await branch.destroy(); // soft delete (paranoid)

      logger.info(`Branch deleted: ${id}`);

      res.json({
        success: true,
        message: 'Branch deleted successfully',
      });
    } catch (error) {
      logger.error('Delete branch error:', error);
      next(error);
    }
  }
}

export default new BranchController();
