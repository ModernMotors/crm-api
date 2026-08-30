import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  branch_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  make: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vehicle make cannot be empty'
      }
    }
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vehicle model cannot be empty'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Year must be an integer'
      },
      min: {
        args: [1900],
        msg: 'Year must be after 1900'
      },
      max: {
        args: [new Date().getFullYear() + 1],
        msg: 'Year cannot be in the future'
      }
    }
  },
  vin: {
    type: DataTypes.STRING(17),
    allowNull: true,
    unique: true,
    validate: {
      len: {
        args: [0, 17],
        msg: 'VIN must be 17 characters or empty'
      }
    }
  },
  license_plate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'License plate cannot be empty'
      }
    }
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  fuel_type: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'other'),
    allowNull: true
  },
  transmission: {
    type: DataTypes.ENUM('manual', 'automatic', 'cvt', 'semi-automatic'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'in_service', 'sold', 'maintenance', 'out_of_service'),
    allowNull: false,
    defaultValue: 'available'
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  purchase_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Other'),
    allowNull: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  estimated_value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  last_service_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  next_service_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  insurance_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  registration_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  engine_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  warranty_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vehicles',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['vin']
    },
    {
      unique: true,
      fields: ['license_plate']
    },
    {
      fields: ['branch_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['make']
    },
    {
      fields: ['model']
    }
  ]
});

export default Vehicle;
