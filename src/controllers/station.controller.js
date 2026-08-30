import Station from '../models/Station.js';
import Branch from '../models/Branch.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

class StationController {
  async getAllStations(req, res) {
    try {
      const { status, type, branch_id, search } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (type) {
        where.type = type;
      }
      
      if (branch_id) {
        where.branch_id = branch_id;
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { name_ar: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      const stations = await Station.findAll({
        where,
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: stations,
        count: stations.length
      });
    } catch (error) {
      logger.error('Get stations error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getStationById(req, res) {
    try {
      const { id } = req.params;
      
      const station = await Station.findByPk(id, {
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
      
      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Station not found'
        });
      }
      
      res.json({
        success: true,
        data: station
      });
    } catch (error) {
      logger.error('Get station error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createStation(req, res) {
    try {
      const stationData = req.body;
      
      const station = await Station.create(stationData);
      
      logger.info(`Station created: ${station.name}`);
      
      res.status(201).json({
        success: true,
        data: station,
        message: 'Station created successfully'
      });
    } catch (error) {
      logger.error('Create station error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const station = await Station.findByPk(id);
      
      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Station not found'
        });
      }
      
      await station.update(updateData);
      
      logger.info(`Station updated: ${station.name}`);
      
      res.json({
        success: true,
        data: station,
        message: 'Station updated successfully'
      });
    } catch (error) {
      logger.error('Update station error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteStation(req, res) {
    try {
      const { id } = req.params;
      
      const station = await Station.findByPk(id);
      
      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Station not found'
        });
      }
      
      await station.destroy();
      
      logger.info(`Station deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Station deleted successfully'
      });
    } catch (error) {
      logger.error('Delete station error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new StationController();
