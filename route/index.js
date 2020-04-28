'use strict';
const express = require('express');
const router = express.Router();
const geoJSON = require('../src/coordinates');
const countries = require('../src/countries-list');
let data;


router.get('/', (req, res) => {
    data = {
        title: 'Coordinates'
    };

    data.res = countries;

    res.render('index', data);
});


router.get('/map', async (req, res) => {
    let country = req.query['country'];
    let nrOfMarkers = parseInt(req.query['nrOfMarkers']);

    data = {
        title: 'Coordinates'
    };

    data.res = {};
    data.res.shape = await geoJSON.get(country);
    data.res.bounds = await geoJSON.bounds(data.res.shape);
    data.res.nrOfMarkers = nrOfMarkers;
    res.render('map', data);
});

router.get('/data/country', async (req, res) => {
    let country = req.query['ISO'];

    let shape = await geoJSON.get(country);
    let bounds = await geoJSON.bounds(shape);

    let data = {
        shape: shape,
        bounds: bounds,
    };

    await res.json(data);
});

router.get('/data/coordinates', async (req, res) => {
    const country = req.query['country'];
    const nrOfMarkers = parseInt(req.query['nrOfMarkers']);

    const shape = await geoJSON.get(country);
    const coordinates = await geoJSON.coordinates(shape, nrOfMarkers);

    let data = {
        geoJSON: coordinates,
    };

    await res.json(data);
});

module.exports = router;
