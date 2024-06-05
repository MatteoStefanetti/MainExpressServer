let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

// ---- Calling the following routes requires the prefix '/clubs'

/** GET route used to retrieve an {@link array} of objects about clubs.
 * @param name {string} - a string to search in the `club_name` column of the 'clubs' table. */
router.get('/get_clubs_by_string/:name', function (req, res) {
    if (req.params.name) {
        fetch('http://localhost:8081/clubs/clubs_by_string/' + String(req.params.name), {
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

/** GET route used to retrieve an {@link array} of objects containing clubs data.
 * @param localCompetitionCode {string} - the "country" code where we assume all the clubs returned are settled in. */
router.get(`/get_clubs_by_local_competition_code/:localCompetitionCode`, function (req, res) {
    if (req.params.localCompetitionCode) {
        fetch('http://localhost:8081/clubs/clubs_by_nation/' + String(req.params.localCompetitionCode), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Error occurred: ' + err));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid localCompetitionCode to search'));
    }
});

module.exports = router;
