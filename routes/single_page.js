let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/single_page'

router.get('/get_player_by_id/:id', function (req, res) {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve data about a player.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the player_id of the player to retrieve.',
        type: 'number',
        required: 'true'
    }
    */
    if (req.params.id) {
        fetch('http://localhost:8081/players/get_player_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else {
        res.status(500).json(JSON.stringify('Error in \'/get_player_by_id/\' GET: id passed was null!'))
    }
})

router.get('/get_nation_name_by_code/:code', (req, res) => {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve name of a country in base of a `league_code`.'
    #swagger.parameters['code'] = {
        in: 'path',
        description: 'a \`domestic_league_code\`.',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    */
    if (req.params.code) {
        fetch('http://localhost:3002/flags/get_nation_by_code/' + String(req.params.code),
            {headers: {'Content-Type': 'application/json'}, method: 'get'})
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Request content was not found.'));
            });
    } else
        res.status(200).json(JSON.stringify({country_name: 'International'}))
});

router.get('/get_visualize_game_by_id/:id', function (req, res) {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'GET route that retrieves game data in base of an \'id\'.'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The game_id of the game we want to analyse.',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Invalid \'id\' passed as input!'
    }
    */
    if (req.params.id) {
        fetch('http://localhost:8081/games/get_game_details_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else
        res.status(500).json(JSON.stringify('Invalid \'id\' passed as input!'))
})

module.exports = router;
