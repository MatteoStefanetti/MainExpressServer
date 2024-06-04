let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

/* ------ Home ------ */

/** GET route called by Home page. */
router.get('/home/get_last_games', async (req, res) => {
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

/** GET route called by Home page. */
router.get('/home/get_recent_clubs_news', async (req, res) => {
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

/** GET route called by Home page. */
router.get('/home/get_trend_players', async (req, res) => {
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

/* ---------------- General Routes ---------------- */

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

/** For now, it is used only in competitions.html. May be called somewhere else in the future. */
router.get('/retrieve_last_season/:competition_id', function (req, res) {
    fetch('http://localhost:8081/games/get_current_season_year/' + String(req.params.competition_id), {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(501).json(err))
})

/* ------- players.html Route ------- */

/** Unique route used in `players.html`. It returns an {@link array} of players objects.
* @param name {string} - the string to search for in the 'player_name' column of the 'players' table. */
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
