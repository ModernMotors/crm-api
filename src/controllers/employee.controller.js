import Employee from '../models/Employee.js';
import Branch from '../models/Branch.js';
import Company from '../models/Company.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class EmployeeController {
  async getAllEmployees(req, res) {
    try {
      const { status, branch_id, company_id, department, search } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (branch_id) {
        where.branch_id = branch_id;
      }
      
      if (company_id) {
        where.company_id = company_id;
      }
      
      if (department) {
        where.department = department;
      }
      
      if (search) {
        where[Op.or] = [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { name_ar: { [Op.iLike]: `%${search}%` } },
          { employee_id: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const employees = await Employee.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
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
        data: employees,
        count: employees.length
      });
    } catch (error) {
      logger.error('Get employees error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      
      const employee = await Employee.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
      
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      
      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error('Get employee error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createEmployee(req, res) {
    try {
      const employeeData = req.body;
      
      const employee = await Employee.create(employeeData);
      
      logger.info(`Employee created: ${employee.first_name} ${employee.last_name}`);
      
      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      logger.error('Create employee error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      
      await employee.update(updateData);
      
      logger.info(`Employee updated: ${employee.first_name} ${employee.last_name}`);
      
      res.json({
        success: true,
        data: employee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      logger.error('Update employee error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }
      
      await employee.destroy();
      
      logger.info(`Employee deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      logger.error('Delete employee error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new EmployeeController();
