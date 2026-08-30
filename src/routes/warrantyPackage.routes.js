import express from 'express';
import warrantyPackageController from '../controllers/warrantyPackage.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', warrantyPackageController.getAllWarrantyPackages.bind(warrantyPackageController));
router.get('/:id', warrantyPackageController.getWarrantyPackageById.bind(warrantyPackageController));
router.post('/', warrantyPackageController.createWarrantyPackage.bind(warrantyPackageController));
router.put('/:id', warrantyPackageController.updateWarrantyPackage.bind(warrantyPackageController));
router.delete('/:id', warrantyPackageController.deleteWarrantyPackage.bind(warrantyPackageController));

export default router;
