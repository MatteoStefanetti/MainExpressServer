let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

/* ------ Home ------ */

/** GET route called by Home page. */
router.get('/get_last_games', async (req, res) => {
    /* #swagger.tags = ['Home']
    #swagger.description = 'GET route to retrieve the list of the last 24 games.'
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Error fetching games from JPA or Error in /get_last_games GET.'
    }
    */
    try {
        const response = await fetch('http://localhost:8081/games/get_last_games', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!response.ok)
            res.status(500).json({error: 'Error fetching games from JPA'})
        const gamesList = await response.json();
        if (!gamesList && !Array.isArray(gamesList.data))
            res.status(404).json({error: 'Response body is empty'})
        res.status(200).json(gamesList)
    } catch (error) {
        console.error(error)
        res.status(500).json(JSON.stringify({error: 'Error in \'/get_last_games/\' GET.'}))
    }
});

/** GET route called by Home page. */
router.get('/get_recent_clubs_news', async (req, res) => {
    /* #swagger.tags = ['Home']
    #swagger.description = 'GET route to retrieve the list of the 12 clubs that played recently.'
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Error fetching clubs from JPA or Error in /get_recent_club_news GET.'
    }
    */
    try {
        const response = await fetch('http://localhost:8081/clubs/get_recent_clubs_news', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!response.ok)
            res.status(500).json({error: 'Error fetching clubs from JPA'})
        const clubsList = await response.json();
        if (!clubsList && !Array.isArray(clubsList.data))
            res.status(404).json({error: 'Response body is empty'})
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
router.get('/get_trend_players', async (req, res) => {
    /* #swagger.tags = ['Home']
    #swagger.description = 'GET route to retrieve the list of 24 players with the higher and more recent valuations.'
    #swagger.responses[500] = {
        description: 'Error retrieving two lists with different size or Error in /trend_players GET.'
    }
    */
    try {
        let filledList = [];
        const firstResponse = await fetch('http://localhost:3002/' +
            'player_valuations/get_last_players_by_valuations', {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!firstResponse.ok)
            res.status(firstResponse.status).json({error: 'Error fetching player_valuations from MongoDB'})
        const valueList = await firstResponse.json();
        let playerValueMap = new Map();
        for (let elem of valueList)
            playerValueMap.set(elem.player_id, elem.market_value_eur)
        const secondResponse = await fetch('http://localhost:8081/players/' +
            'get_players_by_ids/' + String([...playerValueMap.keys()]), {
            headers: {'Content-Type': 'application/json'}, method: 'get'
        });
        if (!secondResponse.ok)
            res.status(secondResponse.status).json({error: 'Error fetching players from JPA'})
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

module.exports = router;