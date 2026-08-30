import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Company = sequelize.define('Company', {
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
        msg: 'Company name cannot be empty'
      }
    }
  },
  name_ar: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  commercial_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Company code cannot be empty'
      },
      is: {
        args: /^[A-Z0-9_-]+$/,
        msg: 'Company code must contain only uppercase letters, numbers, underscores, and hyphens'
      }
    }
  },
  tax_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  registration_number: {
    type: DataTypes.STRING(100),
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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
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
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: 'active'
  },
  type: {
    type: DataTypes.ENUM('manufacturer', 'distributor', 'dealer', 'service_center'),
    allowNull: false,
    defaultValue: 'dealer'
  },
  established_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  contract_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  contract_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  credit_limit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0
  },
  payment_terms: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'companies',
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
      fields: ['type']
    },
    {
      fields: ['city']
    }
  ]
});

export default Company;
