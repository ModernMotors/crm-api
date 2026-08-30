import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MailGroup = sequelize.define('MailGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  group_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Group name cannot be empty'
      }
    }
  },
  group_description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  to_emails: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  cc_emails: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  bcc_emails: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('notifications', 'reports', 'alerts', 'marketing', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'mail_groups',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default MailGroup;
