import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Employee ID cannot be empty'
      }
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name cannot be empty'
      }
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name cannot be empty'
      }
    }
  },
  name_ar: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[+]?[\d\s-()]+$/,
        msg: 'Please provide a valid phone number'
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
  company_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'terminated'),
    allowNull: false,
    defaultValue: 'active'
  },
  hire_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  termination_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  reports_to: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  avatar: {
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
  emergency_contact: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Engineering/Service fields
  role: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Engineer, Service Advisor, Technician, etc.'
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'e.g., Engine Specialist, Brake Expert, etc.'
  },
  working_hours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 8,
    comment: 'Working hours per day'
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Hourly rate for billing'
  },
  slot_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 15,
    comment: 'Appointment slot duration in minutes'
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: null,
      saturday: { start: '09:00', end: '15:00' },
      sunday: null
    },
    comment: 'Weekly work schedule'
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    comment: 'Available for appointments'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['employee_id']
    },
    {
      fields: ['branch_id']
    },
    {
      fields: ['company_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['department']
    }
  ]
});

export default Employee;
