let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/get_competition_by_id/:id', async (req, res) => {
    /*#swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve data about a competition.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the \`competition_id\` of the competition to retrieve.',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    #swagger.responses[500] = {
        description: 'Error in \'/get_competition_by_id/\' GET: id passed was null!'
    }
    */
    if (req.params.id) {
        fetch('http://localhost:3002/competitions/get_competition_by_id/' + String(req.params.id))
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else {
        res.status(500).json(JSON.stringify('Error in \'/get_competition_by_id\' GET: id passed was null'));
    }
});

router.get('/get_all_season/:id', async (req, res) => {
    /*#swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve all the seasons years.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the \`competition_id\` of the competition for which we want to obtain the seasons',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    #swagger.responses[500] = {
    description: 'Error in \'/get_all_season/:id\' GET: id passed was null'
    }
    */
    if (req.params.id) {
        fetch('http://localhost:8081/games/get_all_seasons/' + String(req.params.id))
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else {
        res.status(500).json(JSON.stringify('Error in \'/get_all_season/:id\' GET: id passed was null'));
    }
});

router.get('/get_competition_placing/:id/:season', async (req, res) => {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'GET route that retrieves competition placing in base of an \'id\' and a \'season\'.'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The competition_id of the competition we want the placing.',
        type: 'string',
        required: 'true'
    }
    #swagger.parameters['season'] = {
        in: 'path',
        description: 'The year of the competition we want the placing.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Invalid \'id\' passed as input!'
    }
    */
    if (req.params.id && req.params.season) {
        fetch('http://localhost:8081/games/competition_placing/' + String(req.params.id) + '/' + String(req.params.season), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err));
    } else {
        res.status(500).json(JSON.stringify('Invalid \'id\' or \'season\' passed as input!'));
    }
});

module.exports = router;