/** @prettier */
import express from 'express';
import { dataFile } from '../lib.js';

const router = express.Router();

router.get('/', (req, res) => {
    const vins = Array.isArray(req.query?.vins) ? req.query.vins : [];
    return res.status(200).json(vins.map((vin) => ({ vin, ...dataFile.vehicles[vin] })));
});

router.get('/:vin', (req, res) => {
    const vehicle = dataFile.vehicles[req.params.vin] ?? {};
    return res.status(200).json(vehicle);
});

export default router;
