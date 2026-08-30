import settingService from '../services/setting.service.js';

class SettingController {
  async getAllSettings(req, res) {
    try {
      const filters = {
        category: req.query.category,
        is_public: req.query.is_public,
        search: req.query.search
      };
      
      const settings = await settingService.getAllSettings(filters);
      
      res.json({
        success: true,
        data: settings,
        count: settings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const setting = await settingService.getSettingByKey(key);
      
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      if (error.message === 'Setting not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSettingsByCategory(req, res) {
    try {
      const { category } = req.params;
      const settings = await settingService.getSettingsByCategory(category);
      
      res.json({
        success: true,
        data: settings,
        count: settings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPublicSettings(req, res) {
    try {
      const settings = await settingService.getPublicSettings();
      
      res.json({
        success: true,
        data: settings,
        count: settings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createSetting(req, res) {
    try {
      const userId = req.user?.id || null;
      const setting = await settingService.createSetting(req.validatedData, userId);
      
      res.status(201).json({
        success: true,
        data: setting,
        message: 'Setting created successfully'
      });
    } catch (error) {
      if (error.message === 'Setting with this key already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateSetting(req, res) {
    try {
      const { key } = req.params;
      const userId = req.user?.id || null;
      const setting = await settingService.updateSetting(key, req.validatedData, userId);
      
      res.json({
        success: true,
        data: setting,
        message: 'Setting updated successfully'
      });
    } catch (error) {
      if (error.message === 'Setting not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message === 'This setting cannot be modified') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async bulkUpdateSettings(req, res) {
    try {
      const userId = req.user?.id || null;
      const results = await settingService.bulkUpdateSettings(req.validatedData, userId);
      
      res.json({
        success: true,
        data: results,
        message: `Updated ${results.updated.length} settings successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteSetting(req, res) {
    try {
      const { key } = req.params;
      const result = await settingService.deleteSetting(key);
      
      res.json({
        success: true,
        data: result,
        message: 'Setting deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Setting not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message === 'This setting cannot be deleted') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async resetSettingToDefault(req, res) {
    try {
      const { key } = req.params;
      const setting = await settingService.resetSettingToDefault(key);
      
      res.json({
        success: true,
        data: setting,
        message: 'Setting reset to default successfully'
      });
    } catch (error) {
      if (error.message === 'Setting not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new SettingController();
