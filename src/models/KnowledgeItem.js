import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const KnowledgeItem = sequelize.define('KnowledgeItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'knowledge_categories',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title cannot be empty' }
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  item_type: {
    type: DataTypes.ENUM('article', 'faq', 'guide', 'note', 'link', 'file', 'video'),
    defaultValue: 'article'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
    // e.g. { url, file_url, video_url, author, source }
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'knowledge_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['category_id'] },
    { fields: ['item_type'] },
    { fields: ['is_published'] }
  ]
});

export default KnowledgeItem;
