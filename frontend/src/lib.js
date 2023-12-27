export const devMode = import.meta.env.DEV === true || import.meta.env.MODE === 'development';

export function roundToDigits(num, digitsAfterDecimal = 1) {
    const [int, frac] = String(num).split('.');
    if (!int || digitsAfterDecimal < 0) return Number.NaN;
    if (!(digitsAfterDecimal >= 1) || !frac) return Number.parseInt(int);
    const roundedFrac = Math.round(
        Number.parseFloat(`${frac.slice(0, digitsAfterDecimal)}.${frac.slice(digitsAfterDecimal)}`),
    );
    return Number.parseFloat(`${int}.${roundedFrac}`);
}
