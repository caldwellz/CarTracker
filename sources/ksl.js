/** @prettier */
import { postJSON } from '../lib.js';

export async function getModels() {
    const { data } = await postJSON('https://cars.ksl.com/nextjs-api/proxy', {
        endpoint: '/classifieds/cars/category/getTrimsForMakeModel',
        options: {},
    });
    return data;
}

function transformInput(rawParams) {
    const {
        extColor: paint,
        freeHistoryReport,
        fuelType: fuel,
        intColor: upholstery,
        limit: perPage = 1000,
        makes,
        maxOdometer: mileageTo,
        maxYear: yearTo,
        minOdometer: mileageFrom,
        minYear: yearFrom,
        models,
        page = 1,
        trims,
    } = rawParams;
    return {
        carfaxAvailable: freeHistoryReport ? 1 : undefined,
        fuel,
        // includeFacetCounts: 1,
        make: makes?.join(';'),
        mileageFrom,
        mileageTo,
        model: models?.join(';'),
        paint,
        perPage,
        page,
        trim: trims?.join(';'),
        upholstery,
        yearFrom,
        yearTo,
    };
}

function transformOutput(result, limit) {
    let items = result?.data?.items ?? [];
    if (limit < 24) items = items.slice(0, limit); // KSL returns 24 minimum
    // console.log('Results:', items.length);
    return items.map((item) => {
        const {
            address1 = '',
            address2 = '',
            body,
            carfaxAvailable,
            city = '',
            dealer,
            email,
            favorites,
            firstName,
            fuel,
            id,
            make,
            makeYear,
            mileage,
            mobilePhone,
            model,
            msrp,
            newUsed, // eslint-disable-line unicorn/no-keyword-prefix
            numberDoors,
            paint = [],
            photo = [],
            price,
            primaryPhone,
            sellerType,
            state = '',
            status,
            titleType,
            transmission,
            trim,
            vin,
            zip = '',
        } = item ?? {};
        return {
            active: status === 'Active',
            bodyType: body,
            contact: {
                address: `${address1}${address2 ? ' ' + address2 : ''}, ${city}, ${state} ${zip}`,
                call: primaryPhone || mobilePhone,
                email,
                sellerName: dealer?.dealerName || firstName,
                sellerType,
                text: dealer?.textNumber || mobilePhone,
            },
            doors: numberDoors,
            extColor: paint.sort().join(','),
            favorites,
            freeHistoryReport: carfaxAvailable === true || carfaxAvailable === '1',
            fuelType: fuel,
            listingUrl: `https://cars.ksl.com/listing/${id}`,
            make,
            model,
            msrp,
            preowned: newUsed === 'Used', // eslint-disable-line unicorn/no-keyword-prefix
            odometer: mileage,
            photos: photo.map((p) => (typeof p === 'string' ? JSON.parse(p) : p)),
            price,
            titleType,
            transType: transmission,
            trim,
            vin,
            year: makeYear,
        };
    });
}

export async function search(rawParams = {}) {
    let body = null,
        result = null;
    try {
        const params = transformInput(rawParams);
        body = Object.keys(params).reduce(
            (accumulator, key) =>
                params[key] === undefined ? accumulator : [...accumulator, key, String(params[key])],
            [],
        );
        result = await postJSON('https://cars.ksl.com/nextjs-api/proxy', {
            endpoint: '/classifieds/cars/search/searchByUrlParams',
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-DDM-EVENT-ACCEPT-LANGUAGE': 'en-US',
                },
                body,
            },
        });
        return transformOutput(result, params.perPage);
    } catch (err) {
        console.error('KSL search error:', err, { body, result });
    }
    return [];
}
