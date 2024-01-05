/** @prettier */
import express from 'express';
import helmet from 'helmet';
import { devMode, ipIsAllowListed, loadData } from './lib.js';
const { API_KEY, APP_ADDRESS, APP_PORT, BASE_PATH = '', NODE_ENV } = process.env;

loadData();
const app = express();
app.use(helmet());
app.use(express.json());
if (devMode) {
    app.set('json spaces', 4);
}

app.get('/changedPriceToday', (req, res) => {
    const backdate = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0];
    res.redirect(`${BASE_PATH}/csv/changed?since=${backdate}&keys[]=price&sort=price&apiKey=${API_KEY}`);
});

app.get('/changedPriceThisWeek', (req, res) => {
    const backdate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    res.redirect(`${BASE_PATH}/csv/changed?since=${backdate}&keys[]=price&sort=price&apiKey=${API_KEY}`);
});

app.get('/inactiveThisWeek', (req, res) => {
    const backdate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    res.redirect(`${BASE_PATH}/csv/inactive?since=${backdate}&sort=price&apiKey=${API_KEY}`);
});

app.get('/inactiveThisMonth', (req, res) => {
    const backdate = new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    res.redirect(`${BASE_PATH}/csv/inactive?since=${backdate}&sort=price&apiKey=${API_KEY}`);
});

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    const data = {
        forwardedIp: req.headers['x-forwarded-for'],
        remoteAddress: req.socket?.remoteAddress,
        url: req.originalUrl,
        headers: req.headers,
    };
    if (!ipIsAllowListed(ip) && (req.query.apiKey !== API_KEY || !API_KEY)) {
        console.error('Bad request', data);
        return res.sendStatus(403);
    }
    //if (devMode) console.log('Request from:', data);
    next();
});

import refresh from './routes/refresh.js';
app.use('/refresh', refresh);

import stats from './routes/stats.js';
app.use('/stats', stats);

import details from './routes/details.js';
app.use('/details', details);

import csv from './routes/csv.js';
app.use('/csv', csv);

// Default 404
app.use((req, res) => {
    res.status(404);
    return res.json({
        error: '🔍 Route Not Found',
        requestedUrl: req.originalUrl,
    });
});

app.on('error', (err) => {
    console.log(`Error: ${err}`);
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
});

app.listen(APP_PORT, APP_ADDRESS, () => {
    console.log(`Server listening on ${APP_ADDRESS}:${APP_PORT}, env type:${NODE_ENV ?? 'unknown'}`);
});
