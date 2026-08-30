import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WarrantyPackage = sequelize.define('WarrantyPackage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  company_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  vehicle_type: {
    type: DataTypes.ENUM('Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van'),
    allowNull: false
  },
  vehicle_model: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  model_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  warranty_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Warranty name cannot be empty'
      }
    }
  },
  warranty_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  warranty_period: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Warranty period in months'
  },
  warranty_period_text: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  kilometer_range: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      from: 0,
      to: 100000
    }
  },
  warranty_coverage: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  exclusions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  additional_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'warranty_packages',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['vehicle_type']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['model_year']
    }
  ]
});

export default WarrantyPackage;
