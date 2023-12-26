/** @prettier */
import express from 'express';
import { dataFile, devMode, getMsSince } from '../lib.js';

const baseFields = [
    'newOrUsed',
    'year',
    'make',
    'model',
    'trim',
    'price',
    'extColor',
    'odometer',
    'bodyType',
    'favorites',
    'freeHistoryReport',
    'titleType',
    'transType',
    'fuelType',
    'listingUrl'
];

const router = express.Router();
/*
router.get('/', (req, res, next) => {
    console.log('root');
    req.csvType = 'all';
    next();
});
*/
router.get('/:type?', (req, res) => {
    const startTime = performance.now();
    const type = req.params.type ?? 'all';
    const keys = Array.isArray(req.query?.keys) ? req.query.keys : [];
    res.set({
        'Cache-Control': `max-age=${devMode ? 0 : 900}`,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment;filename=CarTracker${
            type ? '-' + type + (keys.length ? '-' + keys.join('-') : '') : ''
        }.csv`
    });
    const header = ['sellerType', 'vin', ...baseFields]
        .map((field) => {
            const prettyName = field.charAt(0).toUpperCase() + field.slice(1);
            if (type === 'changed' && keys.includes(field)) {
                return `${prettyName}Updated,Old${prettyName},New${prettyName}`;
            }
            return prettyName;
        })
        .join(',');
    const rows = [header];

    filterAndSortVins(req.query ?? {}, type).forEach((vin) => {
        const vehicle = dataFile.vehicles[vin];
        const row = [vehicle.contact.sellerType, vin];
        for (const field of baseFields) {
            let val = vehicle[field] ?? '';
            if (typeof val === 'boolean') val = val ? 'Y' : 'N';
            else if (typeof val === 'string') val = val.replace(',', ';');
            if (type === 'changed' && keys.includes(field)) {
                let { old, changedBetween = [] } = vehicle.updates.filter((upd) => upd.key === field).pop() ?? {};
                const changedAt = (changedBetween[1] ?? '').split('T')[0];
                if (typeof old === 'boolean') old = old ? 'Y' : 'N';
                else if (typeof old === 'string') old = old.replace(',', ';');
                row.push(changedAt, old);
            }
            row.push(val);
        }
        rows.push(row.join(','));
    });
    const output = rows.join('\r\n');
    res.set('X-Response-Time', getMsSince(startTime));
    res.status(200).send(output);
});

function filterAndSortVins(params, type) {
    const { keys = [], since, sort, sortReverse } = params;
    const sortKey = sort ?? sortReverse;
    const sortForward = sortKey === sort;
    const result = Object.keys(dataFile.vehicles).filter((vin) => {
        const vehicle = dataFile.vehicles[vin];
        if ((type === 'inactive') === vehicle.active) return false; // i.e. !(inactive type XOR active vehicle)
        if (type === 'changed') {
            for (const update of vehicle.updates) {
                const matchDate = new Date(since ?? vehicle.updatedAt).toISOString();
                if (update.changedBetween[1] >= matchDate) {
                    if (keys?.length && !keys.includes(update.key)) continue;
                    return true;
                }
            }
            return false;
        }
        return true;
    });
    if (['vin', ...baseFields].includes(sortKey)) {
        result.sort((vinA, vinB) => {
            const a = dataFile.vehicles[vinA][sortKey];
            const b = dataFile.vehicles[vinB][sortKey];
            if (sortForward) return a < b ? -1 : a > b ? 1 : 0;
            else return a > b ? -1 : a < b ? 1 : 0;
        });
    }
    return result;
}
/*
router.get('/changed/:field', (req, res) => {
    const vins = Object.keys(dataFile.vehicles).filter((vin) => {
        for (const update of dataFile.vehicles[vin].updates) {
            const matchDate = new Date(req.query?.since ?? dataFile.vehicles[vin].updatedAt).toISOString();
            if (update.key === req.params.field && update.changedBetween[1] >= matchDate) return true;
        }
        return false;
    });
    sendCsv(res, vins);
});
*/
export default router;
