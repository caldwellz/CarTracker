/** @prettier */
import express from 'express';
import { dataFile } from '../lib.js';

const router = express.Router();

router.get('/', (req, res) => {
    const vins = Array.isArray(req.query?.vin) ? req.query.vin : [];
    return res.status(200).json(vins.map((vin) => ({ vin, ...dataFile.vehicles[vin] })));
});

router.get('/:vin', (req, res) => {
    const vehicle = dataFile.vehicles[req.params.vin] ?? {};
    return res.status(200).json(vehicle);
});

router.get('/:vin/:field', (req, res) => {
    const { field, vin } = req.params;
    const vehicle = dataFile.vehicles[vin] ?? {};
    return res.status(200).json({ [field]: vehicle[field] });
});

export default router;
