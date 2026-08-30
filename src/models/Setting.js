import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Setting key cannot be empty'
      },
      is: {
        args: /^[a-z0-9_]+$/,
        msg: 'Setting key must contain only lowercase letters, numbers, and underscores'
      }
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Can store JSON string for complex values'
  },
  value_type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'date'),
    allowNull: false,
    defaultValue: 'string'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'general',
    validate: {
      isIn: {
        args: [['general', 'branch', 'vehicle', 'appointment', 'contact', 'helpdesk', 'system', 'notification']],
        msg: 'Invalid category'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this setting can be accessed by non-admin users'
  },
  is_editable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether this setting can be modified'
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'settings',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['key']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_public']
    }
  ]
});

export default Setting;
