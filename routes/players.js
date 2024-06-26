let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

/* ------- players.html Route ------- */

/** Unique route used in `players.html`. It returns an {@link array} of players objects.
 * @param name {string} - the string to search for in the 'player_name' column of the 'players' table. */
router.get('/get_players_by_name/:name', function (req, res) {
    /* #swagger.tags = ['Players']
    #swagger.description = 'GET route to retrieve a list of player whose name contains a certain string.'
    #swagger.parameters['name'] = {
        in: 'path',
        description: 'the string that should be in some players\' name',
        type: 'string',
        required: 'true'
    }
    #swagger.responses[404] = {
        description: 'Error occurred: Not Found'
    }
    #swagger.responses[500] = {
        description: 'Please insert a valid name to search'
    }
    */
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
