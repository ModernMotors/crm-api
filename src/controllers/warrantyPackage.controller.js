import WarrantyPackage from '../models/WarrantyPackage.js';
import Company from '../models/Company.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class WarrantyPackageController {
  async getAllWarrantyPackages(req, res) {
    try {
      const { company_id, vehicle_type, is_active, search } = req.query;
      
      const where = {};
      
      if (company_id) {
        where.company_id = company_id;
      }
      
      if (vehicle_type) {
        where.vehicle_type = vehicle_type;
      }
      
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }
      
      if (search) {
        where[Op.or] = [
          { warranty_name: { [Op.iLike]: `%${search}%` } },
          { vehicle_model: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const warrantyPackages = await WarrantyPackage.findAll({
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
        data: warrantyPackages,
        count: warrantyPackages.length
      });
    } catch (error) {
      logger.error('Get warranty packages error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getWarrantyPackageById(req, res) {
    try {
      const { id } = req.params;
      
      const warrantyPackage = await WarrantyPackage.findByPk(id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
      
      if (!warrantyPackage) {
        return res.status(404).json({
          success: false,
          message: 'Warranty package not found'
        });
      }
      
      res.json({
        success: true,
        data: warrantyPackage
      });
    } catch (error) {
      logger.error('Get warranty package error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createWarrantyPackage(req, res) {
    try {
      const warrantyPackageData = req.body;
      
      const warrantyPackage = await WarrantyPackage.create(warrantyPackageData);
      
      logger.info(`Warranty package created: ${warrantyPackage.warranty_name}`);
      
      res.status(201).json({
        success: true,
        data: warrantyPackage,
        message: 'Warranty package created successfully'
      });
    } catch (error) {
      logger.error('Create warranty package error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateWarrantyPackage(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const warrantyPackage = await WarrantyPackage.findByPk(id);
      
      if (!warrantyPackage) {
        return res.status(404).json({
          success: false,
          message: 'Warranty package not found'
        });
      }
      
      await warrantyPackage.update(updateData);
      
      logger.info(`Warranty package updated: ${warrantyPackage.warranty_name}`);
      
      res.json({
        success: true,
        data: warrantyPackage,
        message: 'Warranty package updated successfully'
      });
    } catch (error) {
      logger.error('Update warranty package error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteWarrantyPackage(req, res) {
    try {
      const { id } = req.params;
      
      const warrantyPackage = await WarrantyPackage.findByPk(id);
      
      if (!warrantyPackage) {
        return res.status(404).json({
          success: false,
          message: 'Warranty package not found'
        });
      }
      
      await warrantyPackage.destroy();
      
      logger.info(`Warranty package deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Warranty package deleted successfully'
      });
    } catch (error) {
      logger.error('Delete warranty package error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new WarrantyPackageController();
