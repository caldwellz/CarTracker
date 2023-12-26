/** @prettier */
import express from 'express';
import { dataFile } from '../lib.js';

const router = express.Router();

router.get('/all', (req, res) => {
    const { lastRefresh, counts, colors } = dataFile;
    return res.status(200).json({ lastRefresh, counts, colors });
});

router.get('/colors', (req, res) => {
    return res.status(200).json(dataFile.colors);
});

router.get('/makes', (req, res) => {
    const makes = Object.keys(dataFile.counts);
    const count = makes.length;
    return res.status(200).json({ count, makes });
});

router.get('/models/:make', (req, res) => {
    const make = dataFile.counts[req.params.make] ?? {};
    const models = Object.keys(make);
    const count = models.length;
    return res.status(200).json({ count, models });
});

router.get('/trims/:make/:model', (req, res) => {
    const trims = Object.keys((dataFile.counts[req.params.make] ?? {})[req.params.model] ?? {});
    const count = trims.length;
    return res.status(200).json({ count, trims });
});

router.get('/count/:make/:model', (req, res) => {
    const trims = (dataFile.counts[req.params.make] ?? {})[req.params.model] ?? {};
    return res.status(200).json(trims);
});
/*
router.get('/average/:field', (req, res) => {
    let mean, median, mode;
    const trims = (dataFile.counts[req.params.make] ?? {})[req.params.model] ?? {};
    return res.status(200).json({
        mean,
        median,
        mode,
    });
});
*/
export default router;
