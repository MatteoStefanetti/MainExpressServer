let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/single_page'

/** GET route to retrieve data about a specific game
 * @param id {string} - the game_id of the game to retrieve.
 * */
router.get('/single_page/get_game_by_id/:id', (req, res) => {
    if (req.params.id) {
        fetch('http://localhost:8081/games/get_game_by_id/' + String(req.params.id),
            {headers: {'Content-Type': 'application/json'}, method: 'get'})
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Request content was not found.'));
            });
    } else
        res.status(500).json("Error! Called a GET without the required params. required: 'id'. get: '/get_game_by_id'")
});

/** GET route to retrieve data about a club.
 * @param id - the club_id of the club to retrieve. */
router.get('/get_club_by_id/:id', (req, res) => {
    if (req.params.id) {
        fetch('http://localhost:8081/clubs/get_club_by_id/' + String(req.params.id))
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(JSON.stringify('Request content was not found.')));
    } else
        res.status(500).json(JSON.stringify('Error in \'/get_club_by_id/\' GET: id passed was null!'))
})

/** GET route to retrieve data about a player.
 * @param id - the player_id of the player to retrieve. */
router.get('/get_player_by_id/:id', function (req, res) {
    if (req.params.id) {
        fetch('http://localhost:8081/players/get_player_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(500).json(err))
    } else {
        console.error('Error! params of \'/players/get_players_by_id/\' are wrong!\n');
    }
})

/** GET route to retrieve valuation data about a player
 * @param player_id {string} - the player_id of player_valuation data to retrieve. */
router.get('/get_valuations_of_player/:player_id', (req, res) => {
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

/** GET route to retrieve name of a country in base of a `league_code`.
 * @param code {string} - a `domestic_league_code` */
router.get('/get_nation_name_by_code/:code', (req, res) => {
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

/** GET route to retrieve the name of a club in base of its id.
 * @param club_id {string} - the id of the club of which we want to know the name. */
router.get('/get_club_name_by_id/:club_id', function (req, res) {
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

/** GET route to retrieve an {@link array} with the last games of a club in base of its id.
 * @param club_id {string} - a club id. */
router.get('/get_last_games_by_club/:clubId', function (req, res) {
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

/** GET route called by player single_page.
 * @param id {string} - The 'player_id' of the player whose appearances we are querying. */
router.get('/get_last_appearances/:player_id', async (req, res) => {
    if (req.params.player_id) {
        fetch('http://localhost:3002/appearances/get_every_player_appearances/' + String(req.params.player_id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(500).json(err))
    }
});

/** GET route to retrieve the active squad of a club.
 * @param clubId {string} - the id of the club. */
router.get('/get_current_players/:clubId', function (req, res) {
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

/** Called by club single_page.
 * It retrieves players are the players that stopped playing while in the club with `clubId`.
 * It retrieves an {@link array} of objects containing players data.
 * @param clubId {string} - The id of the club. */
router.get('/get_past_players/:clubId', function (req, res) {
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

/** GET route that retrieves game data in base of an 'id'.
 * @param id {string} - The game_id of the game we want to analyse */
router.get('/get_visualize_game_by_id/:id', function (req, res) {
    if (req.params.id) {
        fetch('http://localhost:8081/games/visualize_game_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(404).json(err))
    } else
        res.status(500).json(JSON.stringify('Invalid \'id\' passed as input!'))
})

module.exports = router;