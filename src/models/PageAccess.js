import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PageAccess = sequelize.define('PageAccess', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  page: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Page name cannot be empty'
      }
    }
  },
  page_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  can_view: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  can_create: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  can_edit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  can_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  can_export: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'page_access',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['role_id']
    },
    {
      fields: ['page']
    },
    {
      unique: true,
      fields: ['role_id', 'page']
    }
  ]
});

export default PageAccess;
