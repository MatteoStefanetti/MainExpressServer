let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/get_game_by_id/:id', async (req, res) => {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve data about a specific game.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the \`game_id\` of the game to retrieve.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    #swagger.responses[500] = {
        description: 'Error! Called a GET without the required params. REQUIRED PARAMETER: \'id\'. GET: \'/get_game_by_id\''
    }
    */
    if (req.params.id) {
        fetch('http://localhost:8081/games/get_game_by_id/' + String(req.params.id),
            {headers: {'Content-Type': 'application/json'}, method: 'get'})
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else
        res.status(500).json("Error! Called a GET without the required params. REQUIRED PARAMETER: 'id'. GET: '/get_game_by_id'")
});

router.get('/get_events_of/:game_id', (req, res) => {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'GET route that retrieves game events data in base of a \'game_id\'.'
     #swagger.parameters['game_id'] = {
        in: 'path',
        description: 'The game_id of the game we want to analyse.',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Invalid \'game_id\' passed as input!'
    }
    */
    if (req.params.game_id) {
        fetch('http://localhost:8081/game_events/get_game_events_by_game_id/' + String(req.params.game_id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else
        res.status(500).json(JSON.stringify('Invalid \'game_id\' passed as input!'))
});

router.get('/get_appearances_of_game/:game_id', async (req, res) => {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'GET route that retrieves appearances data in base of a \'game_id\'.'
     #swagger.parameters['game_id'] = {
        in: 'path',
        description: 'The game_id of which we queried the appearances.',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Invalid \'game_id\' passed as input!'
    }
    */
    if (req.params.game_id) {
        fetch('http://localhost:3002/appearances/get_game_appearances/' + String(req.params.game_id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else
        res.status(500).json(JSON.stringify('Invalid \'game_id\' passed as input!'))
});

router.get('/get_players_by_ids/:list', async (req, res) => {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'GET route that retrieves PlayerCard, given a list of \'id\'s.'
     #swagger.parameters['list'] = {
        in: 'path',
        description: 'The list of player_id of the playerCards to retrieve.',
        type: 'array',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Invalid \'list\' of ids passed as input!'
    }
    */
    if (req.params.list && req.params.list.length) {
        fetch('http://localhost:8081/players/query_players_by_ids/' + String(req.params.list), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err));
    } else {
        res.status(500).json(JSON.stringify('Invalid \'list\' of ids passed as input!'));
    }
});

module.exports = router;