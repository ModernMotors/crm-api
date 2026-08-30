import Vehicle from '../models/Vehicle.js';
import Branch from '../models/Branch.js';
import Contact from '../models/Contact.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import logger from '../utils/logger.js';

class VehicleController {

  async getAllVehicles(req, res, next) {
    try {
      const { branch_id, status, make, model, category, search, sort_by, owner_id } = req.query;
      
      const where = {};
      
      if (branch_id && branch_id !== 'all') {
        where.branch_id = branch_id;
      }
      
      if (status && status !== 'all') {
        where.status = status;
      }
      
      if (make) {
        where.make = make;
      }
      
      if (model) {
        where.model = model;
      }
      
      if (category && category !== 'all') {
        where.category = category;
      }

      if (owner_id) {
        where.owner_id = owner_id;
      }
      
      if (search) {
        where[Op.or] = [
          { make: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { license_plate: { [Op.iLike]: `%${search}%` } },
          { vin: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      let order = [['created_at', 'DESC']];
      
      if (sort_by === 'mileage') {
        order = [['mileage', 'ASC']];
      } else if (sort_by === 'mileage-desc') {
        order = [['mileage', 'DESC']];
      } else if (sort_by === 'plate') {
        order = [['license_plate', 'ASC']];
      } else if (sort_by === 'purchase_date') {
        order = [['purchase_date', 'DESC']];
      }
      
      const vehicles = await Vehicle.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'city']
          },
          {
            model: Contact,
            as: 'owner',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ],
        order
      });
      
      res.json({
        success: true,
        data: vehicles,
        count: vehicles.length
      });
    } catch (error) {
      logger.error('Get vehicles error:', error);
      next(error);
    }
  }

  async getVehicleById(req, res, next) {
    try {
      const { id } = req.params;
      
      const vehicle = await Vehicle.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'address', 'phone']
          },
          {
            model: Contact,
            as: 'owner',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }
      
      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      logger.error('Get vehicle error:', error);
      next(error);
    }
  }

  async getVehicleStats(req, res, next) {
    try {
      const { branch_id } = req.query;
      
      const where = {};
      if (branch_id && branch_id !== 'all') {
        where.branch_id = branch_id;
      }
      
      const totalVehicles = await Vehicle.count({ where });
      
      const statusCounts = await Vehicle.findAll({
        where,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });
      
      const statusStats = {
        available: 0,
        reserved: 0,
        in_service: 0,
        sold: 0,
        maintenance: 0,
        out_of_service: 0
      };
      
      statusCounts.forEach(item => {
        if (statusStats.hasOwnProperty(item.status)) {
          statusStats[item.status] = parseInt(item.count);
        }
      });
      
      const avgMileageResult = await Vehicle.findOne({
        where,
        attributes: [
          [sequelize.fn('AVG', sequelize.col('mileage')), 'avg_mileage']
        ],
        raw: true
      });
      
      const avgMileage = Math.round(avgMileageResult?.avg_mileage || 0);
      
      const totalValueResult = await Vehicle.findOne({
        where,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('estimated_value')), 'total_value']
        ],
        raw: true
      });
      
      const totalValue = parseFloat(totalValueResult?.total_value || 0);
      
      const categoryCounts = await Vehicle.findAll({
        where,
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });
      
      const categoryStats = {};
      categoryCounts.forEach(item => {
        if (item.category) {
          categoryStats[item.category] = parseInt(item.count);
        }
      });
      
      res.json({
        success: true,
        data: {
          totalVehicles,
          statusStats,
          avgMileage,
          totalValue,
          categoryStats
        }
      });
    } catch (error) {
      logger.error('Get vehicle stats error:', error);
      next(error);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const vehicleData = req.body;
      
      // Ensure required fields are present
      if (!vehicleData.branch_id) {
        return res.status(400).json({
          success: false,
          message: 'Branch is required'
        });
      }
      
      if (!vehicleData.make) {
        return res.status(400).json({
          success: false,
          message: 'Make is required'
        });
      }
      
      if (!vehicleData.model) {
        return res.status(400).json({
          success: false,
          message: 'Model is required'
        });
      }
      
      if (!vehicleData.year) {
        return res.status(400).json({
          success: false,
          message: 'Year is required'
        });
      }
      
      if (!vehicleData.license_plate) {
        return res.status(400).json({
          success: false,
          message: 'License plate is required'
        });
      }
      
      const vehicle = await Vehicle.create(vehicleData);
      
      // Re-fetch with associations
      const created = await Vehicle.findByPk(vehicle.id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'city']
          },
          {
            model: Contact,
            as: 'owner',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      
      logger.info(`Vehicle created: ${vehicle.license_plate}`);
      
      res.status(201).json({
        success: true,
        data: created,
        message: 'Vehicle created successfully'
      });
    } catch (error) {
      logger.error('Create vehicle error:', error);
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const vehicle = await Vehicle.findByPk(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }
      
      await vehicle.update(updateData);
      
      // Re-fetch with associations
      const updated = await Vehicle.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code', 'city']
          },
          {
            model: Contact,
            as: 'owner',
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      
      logger.info(`Vehicle updated: ${vehicle.license_plate}`);
      
      res.json({
        success: true,
        data: updated,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      logger.error('Update vehicle error:', error);
      next(error);
    }
  }

  async updateVehicleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const vehicle = await Vehicle.findByPk(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }
      
      await vehicle.update({ status });
      
      logger.info(`Vehicle status updated: ${vehicle.license_plate} to ${status}`);
      
      res.json({
        success: true,
        data: vehicle,
        message: 'Vehicle status updated successfully'
      });
    } catch (error) {
      logger.error('Update vehicle status error:', error);
      next(error);
    }
  }

  async assignOwner(req, res, next) {
    try {
      const { id } = req.params;
      const { owner_id } = req.body;
      
      const vehicle = await Vehicle.findByPk(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }
      
      await vehicle.update({ owner_id });
      
      logger.info(`Vehicle owner assigned: ${vehicle.license_plate} to ${owner_id}`);
      
      res.json({
        success: true,
        data: vehicle,
        message: 'Vehicle owner assigned successfully'
      });
    } catch (error) {
      logger.error('Assign vehicle owner error:', error);
      next(error);
    }
  }

  async bulkDeleteVehicles(req, res, next) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid vehicle IDs'
        });
      }
      
      const deletedCount = await Vehicle.destroy({
        where: {
          id: { [Op.in]: ids }
        }
      });
      
      logger.info(`Bulk deleted vehicles: ${deletedCount} vehicles`);
      
      res.json({
        success: true,
        message: `Deleted ${deletedCount} vehicles successfully`
      });
    } catch (error) {
      logger.error('Bulk delete vehicles error:', error);
      next(error);
    }
  }

  async bulkUpdateVehicles(req, res, next) {
    try {
      const { ids, updates } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid vehicle IDs'
        });
      }
      
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid updates data'
        });
      }
      
      const [updatedCount] = await Vehicle.update(updates, {
        where: {
          id: { [Op.in]: ids }
        }
      });
      
      logger.info(`Bulk updated vehicles: ${updatedCount} vehicles`);
      
      res.json({
        success: true,
        message: `Updated ${updatedCount} vehicles successfully`
      });
    } catch (error) {
      logger.error('Bulk update vehicles error:', error);
      next(error);
    }
  }

  async exportVehicles(req, res, next) {
    try {
      const { branch_id, status, category } = req.query;
      
      const where = {};
      
      if (branch_id) {
        where.branch_id = branch_id;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (category) {
        where.category = category;
      }
      
      const vehicles = await Vehicle.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['name']
          },
          {
            model: Contact,
            as: 'owner',
            attributes: ['first_name', 'last_name']
          }
        ],
        order: [['license_plate', 'ASC']]
      });
      
      // Generate CSV
      const headers = ['License Plate', 'VIN', 'Make', 'Model', 'Year', 'Category', 'Status', 'Mileage', 'Branch', 'Owner', 'Price', 'Purchase Date'];
      const csvRows = [headers.join(',')];
      
      vehicles.forEach(vehicle => {
        const row = [
          vehicle.license_plate,
          vehicle.vin || '',
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.category || '',
          vehicle.status,
          vehicle.mileage || 0,
          vehicle.branch?.name || '',
          vehicle.owner ? `${vehicle.owner.first_name} ${vehicle.owner.last_name}` : '',
          vehicle.price || 0,
          vehicle.purchase_date || ''
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=vehicles.csv');
      res.send(csvContent);
    } catch (error) {
      logger.error('Export vehicles error:', error);
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      const { id } = req.params;
      
      const vehicle = await Vehicle.findByPk(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }
      
      await vehicle.destroy();
      
      logger.info(`Vehicle deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      logger.error('Delete vehicle error:', error);
      next(error);
    }
  }
}

export default new VehicleController();
