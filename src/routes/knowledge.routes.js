import { Router } from 'express';
import knowledgeController from '../controllers/knowledge.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

// Search
router.get('/search', knowledgeController.search);

// Tree
router.get('/tree', knowledgeController.getTree);

// Categories
router.get('/categories', knowledgeController.getAllCategories);
router.post('/categories', knowledgeController.createCategory);
router.get('/categories/:id', knowledgeController.getCategoryById);
router.put('/categories/:id', knowledgeController.updateCategory);
router.delete('/categories/:id', knowledgeController.deleteCategory);

// Items per category
router.get('/categories/:category_id/items', knowledgeController.getItemsByCategory);

// Items CRUD
router.post('/items', knowledgeController.createItem);
router.get('/items/:id', knowledgeController.getItemById);
router.put('/items/:id', knowledgeController.updateItem);
router.delete('/items/:id', knowledgeController.deleteItem);

export default router;
