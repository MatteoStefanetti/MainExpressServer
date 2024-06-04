let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

/* ------ Home ------ */

router.get('/games/get_last_games', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8081/games/get_last_games', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!response.ok)
            res.status(500).json({error: 'Error fetching games from JPA'})
        const gamesList = await response.json();
        if (!gamesList)
            res.status(500).json({error: 'Response body is empty'})
        res.status(200).json(gamesList)
    } catch (error) {
        console.error(error)
        res.status(500).json(JSON.stringify({error: 'Error in \'/get_last_games/\' GET.'}))
    }
});

router.get('/clubs/get_recent_clubs_news', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8081/clubs/get_recent_clubs_news', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!response.ok)
            res.status(500).json({error: 'Error fetching clubs from JPA'})
        const clubsList = await response.json();
        if (!clubsList)
            res.status(500).json({error: 'Response body is empty'})
        Array.from(clubsList).sort((st, nd) => {
            return st.clubName - nd.clubName
        })
        res.status(200).json(clubsList)
    } catch (error) {
        console.error(error)
        res.status(500).json(JSON.stringify({error: 'Error in \'/get_recent_clubs_news/\' GET.'}))
    }
});

router.get('/players/get_trend_players', async (req, res) => {
    try {
        let filledList = [];
        const firstResponse = await fetch('http://localhost:3002/' +
            'player_valuations/get_last_players_by_valuations', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!firstResponse.ok)
            res.status(500).json({error: 'Error fetching player_valuations from MongoDB'})
        const valueList = await firstResponse.json();
        let playerValueMap = new Map();
        for (let elem of valueList)
            playerValueMap.set(elem.player_id, elem.market_value_eur)
        const secondResponse = await fetch('http://localhost:8081/players/' +
            'get_players_by_ids/' + String([...playerValueMap.keys()]), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!secondResponse.ok)
            res.status(500).json({error: 'Error fetching players from JPA'})
        let playerList = await secondResponse.json();
        if (playerList.length !== valueList.length)
            res.status(500).json({error: 'Lists retrieved had different sizes.'})
        /* We have to use a Map, to make sure that every player is associated with his data. */
        filledList = new Map();
        for (let i in playerList) {
            filledList.set(playerList[i].playerId, {
                'playerName': playerList[i].playerName,
                'playerLastName': playerList[i].playerLastName,
                'imageUrl': playerList[i].imageUrl,
                'marketValue': playerValueMap.get(playerList[i].playerId)
            })
        }
        filledList = Array.from(filledList,
            ([playerId, playerData]) => {
                return {playerId, ...playerData}
            })
            .sort((st, nd) => {
                return nd.marketValue - st.marketValue
            })
        res.status(200).json(filledList)
    } catch (error) {
        console.error(error)
        res.status(500).json(JSON.stringify({error: 'Error in \'/trend_players/\' GET.'}))
    }
});

router.get('/players/get_last_appearances/:player_id', async (req, res) => {
    if (req.params.player_id) {
        fetch('http://localhost:3002/appearances/get_every_player_appearances/' + String(req.params.player_id), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => res.status(500).json(err))
    }
});

/* ------ Competitions ------ */

router.get('/get_competitions/:domesticLeagueCode', function (req, res) {
    /** @note _domesticLeagueCode_ can be 'null' to query international competitions */
    const value = (req.params.domesticLeagueCode) ? String(req.params.domesticLeagueCode) : null;
    fetch('http://localhost:3002/competitions/get_national_competitions/' + value, {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err));
});


/** General route that retrieves data in base of an 'id'.
 * For now, used just by `single_page.html`. */
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

/** For now, only used by `competitions.html`. */
router.get('/get_games_by_league/:id/:season', function (req, res) {
    fetch('http://localhost:8081/games/get_games_of_league/' + String(req.params.id) +
        '/' + String(req.params.season), {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err))
})

/* ------ Clubs ------ */

router.get('/clubs/get_current_players/:clubId', function (req, res) {
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

router.get('/clubs/get_past_players/:clubId', function (req, res) {
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

/* ------ General ------ */

/** GET route used by `competitions.html` and `clubs.html`.
 * It returns the 'flags' table from MongoDB. */
router.get('/get_flags', function (req, res) {
    fetch('http://localhost:3002/flags/get_all', {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err));
});

/** For now, it is used only in competitions.html. */
router.get('/retrieve_last_season/:competition_id', function (req, res) {
    fetch('http://localhost:8081/games/get_current_season_year/' + String(req.params.competition_id), {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(501).json(err))
})

/** Used in `players.html`. It returns an {@link array} of players objects.
* @param name {string} - the string to search in the name column of the 'players' table. */
router.get('/get_players_by_name/:name', function (req, res) {
    if (req.params.name) {
        fetch('http://localhost:8081/players/get_players_by_name/' + String(req.params.name), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Request content was not found.'));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid name to search'));
    }
});

module.exports = router;
