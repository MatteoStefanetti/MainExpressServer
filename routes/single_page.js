let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/single_page'

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
})

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
})

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
})

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
})

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
})

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
})
          
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
})

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
})

module.exports = router;
