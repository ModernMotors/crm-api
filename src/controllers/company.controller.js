import Company from '../models/Company.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class CompanyController {
  async getAllCompanies(req, res) {
    try {
      const { status, type, city, search } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (type) {
        where.type = type;
      }
      
      if (city) {
        where.city = city;
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { name_ar: { [Op.iLike]: `%${search}%` } },
          { commercial_name: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const companies = await Company.findAll({
        where,
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: companies,
        count: companies.length
      });
    } catch (error) {
      logger.error('Get companies error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCompanyById(req, res) {
    try {
      const { id } = req.params;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      logger.error('Get company error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createCompany(req, res) {
    try {
      const companyData = req.body;
      
      const company = await Company.create(companyData);
      
      logger.info(`Company created: ${company.name}`);
      
      res.status(201).json({
        success: true,
        data: company,
        message: 'Company created successfully'
      });
    } catch (error) {
      logger.error('Create company error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      await company.update(updateData);
      
      logger.info(`Company updated: ${company.name}`);
      
      res.json({
        success: true,
        data: company,
        message: 'Company updated successfully'
      });
    } catch (error) {
      logger.error('Update company error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      await company.destroy();
      
      logger.info(`Company deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      logger.error('Delete company error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new CompanyController();
