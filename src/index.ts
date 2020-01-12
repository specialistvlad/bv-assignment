import { chain, map, filter, first } from 'lodash';
// import R from 'ramda';
import getDistanceBetweenAirports from './getDistanceBetweenAirports';
import express from 'express';
import bodyParser from 'body-parser';
import flights from './flights.json';

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
        const carr = preferences.includes(carrier);
        return from && to && carr;
    };

    const calculate = (flight: Flight) => {
        const distance = getDistanceBetweenAirports(flight.origin, flight.destination);
        const duration = distance / PLANE_AVG_SPEED;
        return {
            ...flight,
            distance,
            duration,
            coef: duration * CARRIER_PREF_MULTIPLIER + distance,
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

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/flights', (req, res) => {
    const preferences = req.query.preferences.split(',');
    const minDate = new Date(req.query.minDate);
    const maxDate = new Date(req.query.maxDate);
    const minDuration = Number.parseInt(req.query.minDuration);
    const maxDuration = Number.parseInt(req.query.maxDuration);
    const maxDistance = Number.parseInt(req.query.maxDistance);

    res.json(getPreferredFlight(
        flights,
        preferences,
        minDate, 
        maxDate, 
        minDuration,
        maxDuration,
        maxDistance,
        ));
});


app.get('*', (req, res) => {
    res.redirect('/api/v1/flights?preferences=UA,FR,DL,AA,SW&minDate=2017-06-01T21:21:17.719Z&maxDate=2017-06-02T14:21:00.719Z&minDuration=0&maxDuration=5&maxDistance=5000');
});

app.listen(PORT, () => console.log(`Task1 app listening on port ${PORT}!`));