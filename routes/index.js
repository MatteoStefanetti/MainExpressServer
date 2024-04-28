let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/get_flags', function (req, res, next) {
    fetch('http://localhost:3002/flags/get_all', {
        headers: {'Content-Type': 'application/json'},
        method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err));
});

router.get(`/get_clubs_by_local_competition_code/:localCompetitionCode`, function (req, res, next) {
    if (req.params.localCompetitionCode) {
        fetch('http://localhost:8081/clubs/clubs_by_nation/' + String(req.params.localCompetitionCode), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => {
                res.status(404).json(JSON.stringify('Request content was not found.'));
            });
    } else {
        res.status(500).json(JSON.stringify('Please insert a valid localCompetitionCode to search'));
    }
});

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

router.get('/clubs/get_club_by_id/:id', function (req, res) {
    if (req.params.id) {
        fetch('http://localhost:8081/clubs/get_club_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => console.log(err));
    } else {
        console.log('Error! params of \'/clubs/get_club_by_id/\' are wrong!\n')
    }
});

router.get('/get_players_by_id/:id', function (req, res) {
    if (req.params.id) {
        fetch('http://localhost:8081/players/get_player_by_id/' + String(req.params.id), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => console.log(err))
    }
    else {
        console.log('Error! params of \'/players/get_players_by_id/\' are wrong!\n');
    }
})

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
