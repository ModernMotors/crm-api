import Setting from '../models/Setting.js';
import { Op } from 'sequelize';

class SettingService {
  async getAllSettings(filters = {}) {
    const { category, is_public, search } = filters;
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (is_public !== undefined) {
      where.is_public = is_public === 'true';
    }
    
    if (search) {
      where[Op.or] = [
        { key: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const settings = await Setting.findAll({
      where,
      order: [['category', 'ASC'], ['key', 'ASC']]
    });
    
    return settings;
  }

  async getSettingByKey(key) {
    const setting = await Setting.findOne({
      where: { key }
    });
    
    if (!setting) {
      throw new Error('Setting not found');
    }
    
    return setting;
  }

  async getSettingsByCategory(category) {
    const settings = await Setting.findAll({
      where: { category },
      order: [['key', 'ASC']]
    });
    
    return settings;
  }

  async getPublicSettings() {
    const settings = await Setting.findAll({
      where: { is_public: true },
      order: [['category', 'ASC'], ['key', 'ASC']]
    });
    
    return settings;
  }

  async createSetting(settingData, userId) {
    const { key, value, value_type, category, description, is_public, is_editable } = settingData;
    
    // Check if setting with same key already exists
    const existingSetting = await Setting.findOne({ where: { key } });
    if (existingSetting) {
      throw new Error('Setting with this key already exists');
    }
    
    // Parse value based on type
    let parsedValue = value;
    if (value_type === 'number') {
      parsedValue = value ? parseFloat(value) : null;
    } else if (value_type === 'boolean') {
      parsedValue = value === 'true' || value === true;
    } else if (value_type === 'json') {
      try {
        parsedValue = JSON.stringify(JSON.parse(value));
      } catch (e) {
        throw new Error('Invalid JSON value');
      }
    }
    
    const setting = await Setting.create({
      key,
      value: parsedValue,
      value_type,
      category,
      description,
      is_public,
      is_editable,
      created_by: userId
    });
    
    return setting;
  }

  async updateSetting(key, updateData, userId) {
    const setting = await Setting.findOne({ where: { key } });
    
    if (!setting) {
      throw new Error('Setting not found');
    }
    
    if (!setting.is_editable) {
      throw new Error('This setting cannot be modified');
    }
    
    const { value, value_type, description, is_public, is_editable } = updateData;
    
    // Parse value based on type
    let parsedValue = value;
    const typeToUse = value_type || setting.value_type;
    
    if (typeToUse === 'number') {
      parsedValue = value ? parseFloat(value) : null;
    } else if (typeToUse === 'boolean') {
      parsedValue = value === 'true' || value === true;
    } else if (typeToUse === 'json') {
      try {
        parsedValue = JSON.stringify(JSON.parse(value));
      } catch (e) {
        throw new Error('Invalid JSON value');
      }
    }
    
    await setting.update({
      value: parsedValue,
      value_type: typeToUse,
      description,
      is_public,
      is_editable,
      updated_by: userId
    });
    
    return setting;
  }

  async bulkUpdateSettings(settingsData, userId) {
    const results = {
      updated: [],
      errors: []
    };
    
    for (const settingItem of settingsData.settings) {
      try {
        const { key, value } = settingItem;
        const setting = await Setting.findOne({ where: { key } });
        
        if (!setting) {
          results.errors.push({
            key,
            error: 'Setting not found'
          });
          continue;
        }
        
        if (!setting.is_editable) {
          results.errors.push({
            key,
            error: 'This setting cannot be modified'
          });
          continue;
        }
        
        let parsedValue = value;
        if (setting.value_type === 'number') {
          parsedValue = value ? parseFloat(value) : null;
        } else if (setting.value_type === 'boolean') {
          parsedValue = value === 'true' || value === true;
        } else if (setting.value_type === 'json') {
          try {
            parsedValue = JSON.stringify(JSON.parse(value));
          } catch (e) {
            results.errors.push({
              key,
              error: 'Invalid JSON value'
            });
            continue;
          }
        }
        
        await setting.update({
          value: parsedValue,
          updated_by: userId
        });
        
        results.updated.push(setting);
      } catch (error) {
        results.errors.push({
          key: settingItem.key,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async deleteSetting(key) {
    const setting = await Setting.findOne({ where: { key } });
    
    if (!setting) {
      throw new Error('Setting not found');
    }
    
    if (!setting.is_editable) {
      throw new Error('This setting cannot be deleted');
    }
    
    await setting.destroy();
    
    return { message: 'Setting deleted successfully' };
  }

  async resetSettingToDefault(key) {
    const setting = await Setting.findOne({ where: { key } });
    
    if (!setting) {
      throw new Error('Setting not found');
    }
    
    // Define default values for common settings
    const defaults = {
      'app_name': 'Car Branch Manager',
      'app_timezone': 'UTC',
      'date_format': 'YYYY-MM-DD',
      'time_format': 'HH:mm',
      'currency': 'USD',
      'language': 'en',
      'items_per_page': '20',
      'session_timeout': '30',
      'max_upload_size': '5242880',
      'enable_notifications': 'true',
      'enable_email_notifications': 'true',
      'enable_sms_notifications': 'false'
    };
    
    const defaultValue = defaults[key] || '';
    
    await setting.update({
      value: defaultValue
    });
    
    return setting;
  }
}

export default new SettingService();
