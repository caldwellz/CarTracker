import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';
import { roundToDigits } from './lib.js';

export function reportWebVitals(onPerfEntry) {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(onPerfEntry);
        onFCP(onPerfEntry);
        onFID(onPerfEntry);
        onINP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
    }
}

export function logWebVitals() {
    reportWebVitals((vital) => {
        const { name, rating, value } = vital;
        const suffix = name === 'CLS' ? ' shift score' : 'ms';
        console.log(`${name}: ${rating} (${roundToDigits(value, 1)}${suffix})`);
    });
}
