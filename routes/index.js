let express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/get_flags', function(req,res,next) {
    fetch('http://localhost:3002/flags/get_all', {
        headers: { 'Content-Type': 'application/json' },
        method: 'get'
    })
        .then(res => res.json()) // expecting a json response e.g. {field1: 'xxx', field 2: 'yyy'}
        .then(json => res.status(200).json(json))
        .catch(err => res.render('index', {title: err}));
});

module.exports = router;
