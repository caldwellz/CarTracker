/** @prettier */
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true });
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local`, override: true });

const { COMPRESSION_ENABLED, COMPRESSION_LEVEL = 3, NODE_ENV, PATH_PREFIX = '.' } = process.env;
const path = `${PATH_PREFIX}/carData.json`;
export const devMode = NODE_ENV !== 'production';
const compressDb = (COMPRESSION_ENABLED ?? String(!devMode)) === 'true';

export const compress = promisify((buf, cb) =>
    zlib.brotliCompress(
        buf,
        {
            chunkSize: 4 * 1024 * 1024, // Brotli benefits from a much-larger-than-default chunk size, especially on level 1
            params: {
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: COMPRESSION_LEVEL,
                [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf?.length > 0 ? buf.length : 0
            }
        },
        cb
    )
);

export const decompress = promisify((buf, cb) => zlib.brotliDecompress(buf, {}, cb));

export const dataFile = { vehicles: {}, counts: {}, colors: {} };

export async function loadData() {
    let loadedFile = {};
    try {
        console.log('Loading', path);
        if (compressDb) {
            const fileBuf = fs.readFileSync(path + '.br');
            const jsonText = await decompress(fileBuf);
            // console.log('Data file compressed:', fileBuf.length, 'decompressed:', jsonText.length);
            loadedFile = JSON.parse(jsonText);
        } else {
            loadedFile = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
        }
        Object.assign(dataFile, loadedFile);
    } catch (err) {
        console.log('Datafile not readable:', err);
    }
}

export async function saveData() {
    const startTime = performance.now();
    let savings = 0;
    if (compressDb) {
        const data = JSON.stringify(dataFile);
        const output = await compress(data);
        savings = ((data.length - output.length) / data.length) * 100;
        fs.writeFileSync(path + '.br', output);
    } else {
        const output = JSON.stringify(dataFile, null, 4);
        fs.writeFileSync(path, output);
    }
    console.log(`Flushed dataFile in ${getMsSince(startTime)}ms at ${roundToDigits(savings, 1)}% space savings`);
}

export async function postJSON(endpoint, body) {
    const response = await fetch(endpoint, {
        method: 'post',
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'br, gzip, deflate',
            'Accept-Language': 'en-US,en',
            'Content-Type': 'application/json',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const data = await response.json();
    // console.log('Headers:', response.headers);
    return data;
}

export function ipIsAllowListed(ip) {
    const allowList = [/^127\./, /^10\./, /^192\.168\./];
    const ipStr = String(ip);
    for (const regex of allowList) {
        if (ipStr.match(regex)) return true;
    }
    return false;
}

export function roundToDigits(num, digitsAfterDecimal = 1) {
    const [int, frac] = String(num).split('.');
    if (!int || digitsAfterDecimal < 0) return NaN;
    if (!(digitsAfterDecimal >= 1) || !frac) return parseInt(int);
    const roundedFrac = Math.round(
        parseFloat(`${frac.slice(0, digitsAfterDecimal)}.${frac.slice(digitsAfterDecimal)}`)
    );
    return parseFloat(`${int}.${roundedFrac}`);
}

export function getMsSince(start = 0, digitsAfterDecimal = 2) {
    return roundToDigits(performance.now() - start, digitsAfterDecimal);
}
