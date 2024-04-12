let express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/favicon.ico', function(req, res, next) {
   res.status(204).end();
});

router.get('/get_flags', function(req,res,next) {
    fetch('http://localhost:3002/flags/get_all', {
        headers: { 'Content-Type': 'application/json' },
        method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => console.log(err));
});

module.exports = router;
