let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/competitions'

/** GET route used to retrieve the competitions about a 'code'.
 * @param code {string} - a 'domestic_league_code' */
router.get('/get_competitions/:domesticLeagueCode', function (req, res) {
    /* #swagger.tags = ['Competitions']
    #swagger.description = 'GET route to retrieve a list of competition of a certain country.'
    #swagger.parameters['domesticLeagueCode'] = {
        in: 'path',
        description: 'the code of the country to search',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid domesticLeagueCode to search'
    }
    */
    /** @note _domesticLeagueCode_ can be 'null' to query international competitions */
    fetch('http://localhost:3002/competitions/get_national_competitions/' + req.params.domesticLeagueCode, {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err));
});

/** For now, only used by `competitions.html`.
 * @param id {string} - the `competition_id` of the competition we are asking for games.
 * @param season {string} - the year to filter the games in base of their season column. */
router.get('/get_games_by_league/:id/:season', function (req, res) {
    /* #swagger.tags = ['Competitions']
    #swagger.description = 'GET route to retrieve a list of games of a certain competition in a certain season.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'the code that identify the competition',
        type: 'string',
        required: 'true'
    }
    #swagger.parameters['season'] = {
        in: 'path',
        description: 'the year of the season',
        type: 'number',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid id or a valid season to search'
    }
    */
    if (req.params.id && req.params.season) {
        fetch('http://localhost:8081/games/get_games_of_league/' + String(req.params.id) +
            '/' + String(req.params.season), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else
        res.status(500).json(JSON.stringify('Invalid \'id\' or \'season\' passed as input!'))
})

/**
 * Endpoint for retrieving games involving a club.
 *
 * @param clubName The name of the club
 * @return ResponseEntity containing the  List of games involving both clubs if found, or a NOT_FOUND response if no games were found
 */
router.get('/query_games_by_name/:clubName', function (req, res) {
    /* #swagger.tags = ['Competitions']
    #swagger.description = 'GET route to retrieve a list of games in which a club take part.'
    #swagger.parameters['clubName'] = {
        in: 'path',
        description: 'the partial name of the club to search',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid clubName to search'
    }
    */
    if (req.params.clubName) {
        fetch('http://localhost:8081/games/query_games_by_name/' + String(req.params.clubName), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else {
        res.status(500).end('erroneous param')
    }
})

/**
 * Endpoint for retrieving games involving two specific clubs.
 *
 * @param clubName1 The name of the first club
 * @param clubName2 The name of the second club
 * @return ResponseEntity containing the  List of games involving both clubs if found, or a NOT_FOUND response if no games were found
 */
router.get('/query_games_by_double_name/:clubName1/:clubName2', function (req, res) {
    /* #swagger.tags = ['Competitions']
    #swagger.description = 'GET route to retrieve a list of games in which 2 clubs take part.'
    #swagger.parameters['clubName1'] = {
        in: 'path',
        description: 'the partial name of the first club',
        type: 'string',
        required: 'true'
    }
    #swagger.parameters['clubName2'] = {
        in: 'path',
        description: 'the partial name of the second club',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid clubName1 or a valid clubName2 to search'
    }
    */
    if (req.params.clubName1 && req.params.clubName2) {
        fetch('http://localhost:8081/games/query_games_by_double_name/' + String(req.params.clubName1) + '/' + String(req.params.clubName2), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else {
        res.status(500).end('erroneous params')
    }
})

/**
 * Endpoint for retrieving games involving two specific clubs.
 *
 * @param gameDate The date when games were played. Must be sent as yyyy-mm-dd
 * @return ResponseEntity containing the  List of games involving both clubs if found, or a NOT_FOUND response if no games were found
 */
router.get('/query_games_by_date/:gameDate', function (req, res) {
    /* #swagger.tags = ['Competitions']
    #swagger.description = 'GET route to retrieve a list of games that take part in a certain date.'
    #swagger.parameters['gameDate'] = {
        in: 'path',
        description: 'the date when the game take part',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid gameDate to search'
    }
    */
    if (req.params.gameDate) {
        fetch('http://localhost:8081/games/query_games_by_date/' + (req.params.gameDate), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else {
        res.status(500).end('erroneous params')
    }
})

module.exports = router;
