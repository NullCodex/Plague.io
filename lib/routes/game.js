// This files dictates the actions for the GAME end point

var nuuid = require('node-uuid');

module.exports = function(app, db) {

    var collection = db.collection('game');

    app.get('/game', function(req, res) {

        collection.find().toArray(function(err, docs) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while retrieving the game docs"
                });
            }
            return res.status(200).json({
                items: docs
            })
        });
    });

    app.get('/game/:uuid', function(req, res) {
        collection.find({
            "_id": req.params.uuid
        }).toArray(function(err, doc) {
            if (!doc.length)
                return res.status(500).json({
                    "message": "The uuid returned no results"
                });

            return res.status(200).json({
                "item": doc[0]
            });
        });

    });

    // have a function that initializes the cities and their respective cards?
    app.post('/game', function(req, res) {

        var uuid = nuuid.v4();

        var documentBody = {
            _id: uuid,
            players: req.body.players,
            cities: [],
            cityCards: [],
            usedCityCards: [],
            infectionCards: [],
            usedInfectionCards: [],
            diseases: [],
            cures: []
        };
        collection.insert(documentBody, function(err, doc) {
            if(err)
                return res.status(500).json({
                    "message": "An error occurred during the insertion"
                });

            return res.status(201).location("http://plague-io.herokuapp.com/" + uuid).send('The game has been created');
        });
    });

};