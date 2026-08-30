import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Branch name cannot be empty'
      }
    }
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Branch code cannot be empty'
      },
      is: {
        args: /^[A-Z0-9_-]+$/,
        msg: 'Branch code must contain only uppercase letters, numbers, underscores, and hyphens'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Egypt'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'closed'),
    allowNull: false,
    defaultValue: 'active'
  },
  is_main_branch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  branch_type: {
    type: DataTypes.ENUM('showroom', 'service_center', 'warehouse', 'office'),
    allowNull: false,
    defaultValue: 'showroom'
  },
  working_hours: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  opening_hours: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      sunday: { open: '09:00', close: '17:00', is_closed: false },
      monday: { open: '09:00', close: '17:00', is_closed: false },
      tuesday: { open: '09:00', close: '17:00', is_closed: false },
      wednesday: { open: '09:00', close: '17:00', is_closed: false },
      thursday: { open: '09:00', close: '17:00', is_closed: false },
      friday: { open: '09:00', close: '17:00', is_closed: false },
      saturday: { open: '09:00', close: '17:00', is_closed: false }
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  tableName: 'branches',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['status']
    },
    {
      fields: ['manager_id']
    },
    {
      fields: ['city']
    },
    {
      fields: ['company_id']
    }
  ]
});

export default Branch;
