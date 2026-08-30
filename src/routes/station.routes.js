import express from 'express';
import stationController from '../controllers/station.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', stationController.getAllStations.bind(stationController));
router.get('/:id', stationController.getStationById.bind(stationController));
router.post('/', stationController.createStation.bind(stationController));
router.put('/:id', stationController.updateStation.bind(stationController));
router.delete('/:id', stationController.deleteStation.bind(stationController));

export default router;
