import express from 'express';
import bodyParser from 'body-parser';

import flights from './flights.json';
import { getPreferredFlight } from './getPreferredFlight';

const PORT = 3001;

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