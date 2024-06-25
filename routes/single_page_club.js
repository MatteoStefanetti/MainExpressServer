let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/get_club_by_id/:id', (req, res) => {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve data about a club.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the \`club_id\` of the club to retrieve.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Request content was not found.'
    }
    #swagger.responses[500] = {
        description: 'Error in \'/get_club_by_id/\' GET: id passed was null!'
    }
    */
    if (req.params.id) {
        fetch('http://localhost:8081/clubs/get_club_by_id/' + String(req.params.id))
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else
        res.status(500).json(JSON.stringify('Error in \'/get_club_by_id/\' GET: id passed was null!'))
});

router.get('/get_last_games_by_club/:clubId', function (req, res) {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve an `array` with the last games of a club in base of its id.'
    #swagger.parameters['clubId'] {
        in: 'path',
        description: 'the \`club_id\`.',
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
    if (req.params.clubId) {
        fetch('http://localhost:8081/games/get_last_games_by_club/' + String(req.params.clubId), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Error occurred: ' + err));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid club id to search'));
    }
});

router.get('/get_current_players/:clubId', function (req, res) {
    /* #swagger.tags = ['Single Page']
    #swagger.description = 'GET route to retrieve the active squad of a club.'
    #swagger.parameters['clubId'] = {
        in: 'path',
        description: 'the id of the club.',
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
    if (req.params.clubId) {
        fetch('http://localhost:8081/clubs/get_current_players/' + String(req.params.clubId), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Error occurred: ' + err));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid club id to search'));
    }
});

router.get('/get_past_players/:clubId', function (req, res) {
    /* #swagger.tags = ['Single Page']
     #swagger.description = 'It retrieves players are the players that stopped playing while in the club with `clubId`.'
     #swagger.parameters['clubId'] = {
        in: 'path',
        description: 'The id of the club.',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid club id to search'
    }
    */
    if (req.params.clubId) {
        fetch('http://localhost:8081/clubs/get_past_players/' + String(req.params.clubId), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Error occurred: ' + err));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid club id to search'));
    }
});

module.exports = router;