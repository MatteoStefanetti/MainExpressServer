let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

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

module.exports = router;
