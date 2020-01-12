import { getPreferredFlight } from '.';
import flights from './flights.json';

test('stack size', () => {
    expect.assertions(1);
    const result = getPreferredFlight(
        flights,
        [ 'UA', 'FR', 'DL', 'AA', 'SW'],
        new Date('2017-06-01T21:21:17.719Z'), 
        new Date('2017-06-02T14:21:00.719Z'), 
        0,
        10,
        5000,
        );

    expect(result).toStrictEqual({
        "arrivalTime": "2017-06-02T17:21:17.511Z",
        "carrier": "UA",
        "departureTime": "2017-06-01T21:21:17.511Z",
        "destination": "DEN",
        "origin": "AUS",
    });
});