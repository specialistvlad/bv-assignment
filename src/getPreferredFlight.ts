import { chain, map, filter, first } from 'lodash';
// import R from 'ramda';
import getDistanceBetweenAirports from './getDistanceBetweenAirports';

const PORT = 3001;
const CARRIER_PREF_MULTIPLIER = 0.9 // preferred carrier multiplier
const MILES_COEF = 1.60934;
const PLANE_AVG_SPEED = 750;

type Flight = {
    departureTime: string,
    arrivalTime: string,
    carrier: string,
    origin: string,
    destination: string,
}

type ExtendedFlight = {
    distance: number,
    duration: number,
    coef: number,
}

export function getPreferredFlight(
    flights: Array<Flight>,
    preferences: Array<string>,
    minDate: Date, 
    maxDate: Date, 
    minDuration: number, // hours
    maxDuration: number, // hours
    maxDistance: number  // miles
): Flight {
    const maxDistInKm = maxDistance * MILES_COEF;
    const preFilter = ({ departureTime, arrivalTime, carrier }: Flight) => {
        const from = minDate >= new Date(departureTime);
        const to = maxDate <= new Date(arrivalTime);
        // const carr = preferences.includes(carrier);
        return from && to;
    };

    const calculate = (flight: Flight) => {
        const distance = getDistanceBetweenAirports(flight.origin, flight.destination);
        const duration = distance / PLANE_AVG_SPEED;
        return {
            ...flight,
            distance,
            duration,
            coef: duration * (preferences.includes(flight.carrier) ? CARRIER_PREF_MULTIPLIER : 1) + distance,
        };
    };

    const postFilter = ({ duration, distance }: ExtendedFlight) =>
        duration >= minDuration && duration <= maxDuration && distance <= maxDistance;

    return chain(flights)
        .filter(preFilter)
        .map(calculate)
        .filter(postFilter)
        .sortBy(['coef'])
        .first()
        .pick(['departureTime','arrivalTime','carrier','origin','destination'])
        .value();
}
