import Definition from '../models/Definition.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class DefinitionController {
  async getAllDefinitions(req, res) {
    try {
      const { type, category, is_active, search } = req.query;
      
      const where = {};
      
      if (type) {
        where.type = type;
      }
      
      if (category) {
        where.category = category;
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
      
      const definitions = await Definition.findAll({
        where,
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      
      res.json({
        success: true,
        data: definitions,
        count: definitions.length
      });
    } catch (error) {
      logger.error('Get definitions error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDefinitionById(req, res) {
    try {
      const { id } = req.params;
      
      const definition = await Definition.findByPk(id);
      
      if (!definition) {
        return res.status(404).json({
          success: false,
          message: 'Definition not found'
        });
      }
      
      res.json({
        success: true,
        data: definition
      });
    } catch (error) {
      logger.error('Get definition error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createDefinition(req, res) {
    try {
      const definitionData = req.body;
      
      const definition = await Definition.create(definitionData);
      
      logger.info(`Definition created: ${definition.name}`);
      
      res.status(201).json({
        success: true,
        data: definition,
        message: 'Definition created successfully'
      });
    } catch (error) {
      logger.error('Create definition error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateDefinition(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const definition = await Definition.findByPk(id);
      
      if (!definition) {
        return res.status(404).json({
          success: false,
          message: 'Definition not found'
        });
      }
      
      await definition.update(updateData);
      
      logger.info(`Definition updated: ${definition.name}`);
      
      res.json({
        success: true,
        data: definition,
        message: 'Definition updated successfully'
      });
    } catch (error) {
      logger.error('Update definition error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteDefinition(req, res) {
    try {
      const { id } = req.params;
      
      const definition = await Definition.findByPk(id);
      
      if (!definition) {
        return res.status(404).json({
          success: false,
          message: 'Definition not found'
        });
      }
      
      await definition.destroy();
      
      logger.info(`Definition deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Definition deleted successfully'
      });
    } catch (error) {
      logger.error('Delete definition error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new DefinitionController();
