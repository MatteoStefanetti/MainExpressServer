let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/competitions'

/** GET route used to retrieve the competitions about a 'code'.
 * @param code {string} - a 'domestic_league_code' */
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

/** For now, only used by `competitions.html`.
 * @param id {string} - the `competition_id` of the competition we are asking for games.
 * @param season {string} - the year to filter the games in base of their season column. */
router.get('/get_games_by_league/:id/:season', function (req, res) {
    fetch('http://localhost:8081/games/get_games_of_league/' + String(req.params.id) +
        '/' + String(req.params.season), {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err))
})

module.exports = router;module.exports = router;
