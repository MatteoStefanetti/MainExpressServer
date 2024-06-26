let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');
const {json} = require("express");

/* ---------------- General Routes ---------------- */

/** GET route used by `competitions.html` and `clubs.html`.
 * It returns the 'flags' table from MongoDB. */
router.get('/get_flags', function (req, res) {
    /* #swagger.tags = ['Various']
    #swagger.description = 'GET route to retrieve the flags\' images of all the country in the database.'
    #swagger.responses[500] = {
        description: 'Error in retrieving all the flags.'
    }
    */
    fetch('http://localhost:3002/flags/get_all', {
        headers: {'Content-Type': 'application/json'}, method: 'get'
    })
        .then(res => res.json())
        .then(json => res.status(200).json(json))
        .catch(err => res.status(500).json(err));
});

/** For now, it is used only in competitions.html. May be called somewhere else in the future. */
router.get('/retrieve_last_season/:competition_id', function (req, res) {
        /* #swagger.tags = ['Single Page Competition']
        #swagger.description = 'GET route to retrieve the last season of a competition.'
        #swagger.parameters['competition_id'] = {
            in: 'path',
            description: 'the id of the competition to retrieve.',
            type: 'string',
            required: 'true'
        }
        #swagger.responses[404] = {
            description: 'Error occurred: Not Found'
        }
        #swagger.responses[500] = {
            description: 'Please insert a valid competition_id to search.'
        }
        */
        if (req.params.competition_id) {
            fetch('http://localhost:8081/games/get_current_season_year/' + String(req.params.competition_id), {
                headers: {'Content-Type': 'application/json'}, method: 'get'
            })
                .then(res => res.json())
                .then(json => res.status(200).json(json))
                .catch(err => res.status(404).json(err))
        } else
            res.status(500).json(JSON.stringify('Please insert a valid competition_id to search'));
    }
)


module.exports = router;
