import express from 'express';
import definitionController from '../controllers/definition.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', definitionController.getAllDefinitions.bind(definitionController));
router.get('/:id', definitionController.getDefinitionById.bind(definitionController));
router.post('/', definitionController.createDefinition.bind(definitionController));
router.put('/:id', definitionController.updateDefinition.bind(definitionController));
router.delete('/:id', definitionController.deleteDefinition.bind(definitionController));

export default router;
