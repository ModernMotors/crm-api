import express from 'express';
import mailGroupController from '../controllers/mailGroup.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', mailGroupController.getAllMailGroups.bind(mailGroupController));
router.get('/:id', mailGroupController.getMailGroupById.bind(mailGroupController));
router.post('/', mailGroupController.createMailGroup.bind(mailGroupController));
router.put('/:id', mailGroupController.updateMailGroup.bind(mailGroupController));
router.delete('/:id', mailGroupController.deleteMailGroup.bind(mailGroupController));

export default router;
