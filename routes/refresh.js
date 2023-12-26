/** @prettier */
import express from 'express';
import { dataFile, saveData, getMsSince, roundToDigits } from '../lib.js';
import { search } from '../sources/ksl.js';

const router = express.Router();
const limit = 96;
const searchFilter = {
    limit,
    fuelType: 'Electric',
    minYear: 2017,
    maxYear: 2021,
};
const ignoreUpdates = ['updatedAt', 'vin'];
const ignoreChanges = new Set([...ignoreUpdates, 'active', 'contact', 'newOrUsed', 'photos', 'preowned']);

function processUpdates(results) {
    let batchAdded = 0;
    let batchChanged = 0;
    const batchActiveVins = [];
    const { counts, vehicles, colors } = dataFile;
    for (const vehicle of results) {
        const updatedAt = new Date().toISOString();
        vehicle.trim = vehicle.trim ?? 'Base';
        const { make, model, trim, extColor, vin, ...otherData } = vehicle;
        batchActiveVins.push(vin);
        counts[make] = counts[make] || {};
        counts[make][model] = counts[make][model] || {};
        counts[make][model][trim] = (counts[make][model][trim] ?? 0) + 1;
        const color = extColor || 'Unspecified';
        colors[color] = (colors[color] ?? 0) + 1;
        const oldListing = vehicles[vin];
        if (!oldListing) {
            vehicles[vin] = {
                make,
                model,
                trim,
                extColor,
                updates: [],
                updatedAt,
                ...otherData,
            };
            ++batchAdded;
            continue;
        }

        let didChange = false;
        for (const key of Object.keys(vehicle)) {
            if (ignoreChanges.has(key)) {
                if (!ignoreUpdates.includes(key)) vehicles[vin][key] = vehicle[key];
                continue;
            }
            if (vehicle[key] !== oldListing[key]) {
                vehicles[vin].updates.push({
                    key,
                    old: oldListing[key],
                    new: vehicle[key],
                    changedBetween: [oldListing.updatedAt, updatedAt],
                });
                vehicles[vin][key] = vehicle[key];
                didChange = true;
            }
        }
        if (didChange) {
            ++batchChanged;
        }
        vehicles[vin].updatedAt = updatedAt;
    }
    return { batchAdded, batchChanged, batchActiveVins };
}

router.get('/', async (req, res) => {
    try {
        /*
        const models = await getModels();
        setData('models', models);
        */
        const startTime = performance.now();
        const activeVins = [];
        let page = 0,
            processed = 0,
            added = 0,
            changed = 0,
            deactivated = 0;
        dataFile.counts = {};
        dataFile.colors = {};
        while (true) {
            const results = await search({ ...searchFilter, page: ++page });
            const { batchAdded, batchChanged, batchActiveVins } = processUpdates(results);
            processed += results.length;
            //console.log({ page, batchAdded, batchChanged, processed });
            added += batchAdded;
            changed += batchChanged;
            activeVins.push(...batchActiveVins);
            if (results.length < limit || page >= 10) break; // KSL starts to fail/rate-limit after 10 pages
        }
        const inactiveVins = Object.keys(dataFile.vehicles).filter((vin) => !activeVins.includes(vin));
        for (const vin of inactiveVins) {
            if (dataFile.vehicles[vin].active !== false) ++deactivated;
            dataFile.vehicles[vin].active = false;
        }
        dataFile.lastRefresh = new Date().toISOString();
        saveData();
        return res.status(200).json({
            known: Object.keys(dataFile.vehicles).length,
            deactivated,
            processed,
            added,
            changed,
            timeMs: getMsSince(startTime),
            pageAvgMs: roundToDigits(getMsSince(startTime) / page),
        });
    } catch (err) {
        console.error(req.originalUrl + ':', err);
    }
    return res.sendStatus(500);
});
/*
router.get('/data', (req, res) => {
    return res.status(200).json(dataFile);
});

router.get('/:name', (req, res) => {
    const startTime = performance.now();
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    const { name } = req.params;
    dataFile[name] = ip;
    const endTime = performance.now();
    const details = { [name]: ip, time: roundToDigits(endTime - startTime, 3) + 'ms' };
    console.log('New IP:', details);
    return res.status(200).json(details);
});
*/
export default router;
