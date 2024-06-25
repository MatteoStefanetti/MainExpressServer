let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/get_valuations_of_player/:player_id', (req, res) => {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve valuation data about a player.'
    #swagger.parameters['player_id'] = {
        in: 'path',
        description: 'the \`player_id\` of *player_valuation* data to retrieve.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid player_id to search'
    }
    */
    if (req.params.player_id) {
        fetch('http://localhost:3002/player_valuations/get_valuations_of_player/' + String(req.params.player_id),
            {headers: {'Content-Type': 'application/json'}, method: 'get'})
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Request content was not found.'));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid player_id to search'));
    }
});

router.get('/get_club_name_by_id/:club_id', function (req, res) {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve the name of a club in base of its id.'
    #swagger.parameters['club_id'] = {
        in: 'path',
        description: 'the id of the club of which we want to know the name.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid club id to search'
    }
    */
    if (req.params.club_id) {
        fetch('http://localhost:8081/clubs/get_club_name_by_id/' + String(req.params.club_id), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid name to search'));
    }
});

router.get('/get_last_appearances/:player_id', async (req, res) => {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route called by player single_page.'
    #swagger.parameters['player_id'] {
        in: 'path',
        description: 'The \'player_id\' of the player whose appearances we are querying.',
        type: 'number',
        required: 'true'
    }
    */
    if (req.params.player_id) {
        fetch('http://localhost:3002/appearances/get_every_player_appearances/' + String(req.params.player_id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).send(JSON.stringify('Error occurred: ' + err)))
    }
    else {
        res.status(500).json(JSON.stringify('Please insert a valid appearance to search'));
    }
});

module.exports = router;
