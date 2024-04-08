let express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/get_flags', function(req,res,next) {
    fetch('http://localhost:3002/flags/get_all', {
        headers: {'Content-Type': 'application/json'},
        method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => console.log(err));
});

router.get(`/get_clubs_by_local_competition_code/:localCompetitionCode`, function(req, res, next) {
    if(req.params.localCompetitionCode) {
        fetch('http://localhost:8081/clubs_by_nation/' + String(req.params.localCompetitionCode), {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(res => res.json())
            .then(json => res.status(200).json(json))
            .catch(err => console.log(err));
    } else {
        console.log('Error! params of \'/get_clubs_by_local_competition_code\' are wrong!\n')
    }
});

module.exports = router;
