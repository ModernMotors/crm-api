import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Station = sequelize.define('Station', {
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
        msg: 'Station name cannot be empty'
      }
    }
  },
  name_ar: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Station code cannot be empty'
      },
      is: {
        args: /^[A-Z0-9_-]+$/,
        msg: 'Station code must contain only uppercase letters, numbers, underscores, and hyphens'
      }
    }
  },
  branch_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('service_bay', 'inspection', 'wash', 'parking', 'storage', 'showroom'),
    allowNull: false,
    defaultValue: 'service_bay'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'closed'),
    allowNull: false,
    defaultValue: 'active'
  },
  equipment: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'stations',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['branch_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    }
  ]
});

export default Station;
