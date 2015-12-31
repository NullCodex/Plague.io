// This files dictates the actions for the game end point
var nuuid = require('node-uuid'),
    _ = require('underscore'),
    gameConfig = require('../../config/gameConfig');

module.exports = function(app, db) {

    var collection = db.collection('game'),
        playerCollection = db.collection('player'),
        cityCollection = db.collection('city'),
        cityCardCollection = db.collection('cityCard'),
        infectionCardCollection = db.collection('infectionCard'),
        researchCentreCollection = db.collection('researchCentre');

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

    app.post('/game', function(req, res) {

        var playerNames = req.body.players;
        var atlantaUuid = nuuid.v4();
        var postCityCardsSetup = {};
        var postInfectionCardsSetup = {};
        var postCitySetup = {};
        var postPlayerSetup = {};

        var documentBody = {
            players: [],
            cities: [],
            cityCards: [],
            usedCityCards: [],
            infectionCards: [],
            usedInfectionCards: [],
            diseases: gameConfig.gameDiseases,
            cures: gameConfig.gameCures
        };

        postCityCardsSetup = setupCityCards();
        postInfectionCardsSetup = setupInfectionCards();
        postPlayerSetup = setupPlayer(playerNames, atlantaUuid);
        postCitySetup = setupCity(atlantaUuid, postPlayerSetup.playersUuids);

        cityCardCollection.insertMany(postCityCardsSetup.cityCardsdDocuments, function(err, r) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while creating the cityCards"
                });
            }

            infectionCardCollection.insertMany(postInfectionCardsSetup.infectionCardsdDocuments, function(err, r) {
                if (err) {
                    return res.status(500).json({
                        "message": "An error occurred while creating the infectionCards"
                    });
                }

                playerCollection.insertMany(postPlayerSetup.playersDocuments, function(err, r) {
                    if (err) {
                        return res.status(500).json({
                            "message": "An error occurred while creating the players"
                        });
                    }

                    cityCollection.insertMany(postCitySetup.citiesDocuments, function(err, r) {
                        if (err) {
                            return res.status(500).json({
                                "message": "An error occurred while creating the cities"
                            });
                        }

                        var gameUuid = nuuid.v4();

                        documentBody.players = postPlayerSetup.playersUuids;
                        documentBody.cities = postCitySetup.citiesUuids;
                        documentBody.cityCards = postCityCardsSetup.cityCardsUuids;
                        documentBody.infectionCards = postInfectionCardsSetup.infectionCardsUuids;
                        documentBody._id = gameUuid;

                        collection.insertOne(documentBody, function(err, r) {
                            if (err) {
                                return res.status(500).json({
                                    "message": "An error occurred while creating the game"
                                });
                            }

                            return res.status(201).location("http://plague-io.herokuapp.com/game/" + gameUuid).send('The game has been created');
                        });
                    });
                });

            });
        });
    });

    app.delete('game/:uuid', function(req, res) {
        collection.deleteOne({
            "_id": req.params.uuid
        }).toArray(function(err, doc) {
            if (!doc.length)
                return res.status(500).json({
                    "message": "An error occurred while deleting the game"
                });

            return res.sendStatus(204);
        });


    });

};


/*---------------- Helper Functions --------------------*/

/**
 * @param {Object} returnObject - The returned objects
 * @param {Array} returnObject.cityCardsDocuments - An array of cityCards documents for db insert
 * @param {Array} returnObject.cityCardsUuids - An array of cityCards uuids
 */

/**
 * Returns an object that contains the cityCards documents needed for db insert
 * and the list of cityCards uuids
 *
 * @param empty param
 */

function setupCityCards() {
    var cityCardsdDocuments = [];
    var cityCardsUuids = [];
    var returnObject = {};

    for (var i = 0; i < gameConfig.cities.length; i++) {
        var cityCardDocument = JSON.parse(JSON.stringify(gameConfig.cities[i]));
        var cityCardUuid = nuuid.v4();
        cityCardDocument._id = cityCardUuid;
        cityCardsdDocuments.push(cityCardDocument);
        cityCardsUuids.push(cityCardUuid);
    }
    returnObject.cityCardsdDocuments = cityCardsdDocuments;
    returnObject.cityCardsUuids = cityCardsUuids;

    return returnObject;
}

/**
 * @param {Object} returnObject - The returned objects
 * @param {Array} returnObject.infectionCardsDocuments - An array of infectionCards documents for db insert
 * @param {Array} returnObject.infectionCardsUuids - An array of infectionCards uuids
 */

/**
 * Returns an object that contains the infectionCards documents needed for db insert
 * and the list of infectionCards uuids
 *
 * @param empty param
 */

function setupInfectionCards() {
    var infectionCardsdDocuments = [];
    var infectionCardsUuids = [];
    var returnObject = {};

    for (var i = 0; i < gameConfig.cities.length; i++) {
        var infectionCardDocument = JSON.parse(JSON.stringify(gameConfig.cities[i]));
        var infectionCardUuid = nuuid.v4();
        infectionCardDocument._id = infectionCardUuid;
        infectionCardsdDocuments.push(infectionCardDocument);
        infectionCardsUuids.push(infectionCardUuid);
    }
    returnObject.infectionCardsdDocuments = infectionCardsdDocuments;
    returnObject.infectionCardsUuids = infectionCardsUuids;

    return returnObject;
}

/**
 * @param {Object} returnObject - The returned objects
 * @param {Array} returnObject.playersDocuments - An array of players documents for db insert
 * @param {Array} returnObject.playersUuids - An array of players uuids
 */

/**
 * Returns an object that contains the players documents needed for db insert
 * and the list of players uuids
 *
 * @param {Array} playerNames - An array of player names such as ['Tim']
 * @param {String} atlantaUuid - The uuid for 'Atlanta'
 */

function setupPlayer(playerNames, atlantaUuid) {
    var playersDocuments = [];
    var playersUuids = [];
    var returnObject = {};

    for (var i = 0; i < playerNames.length; i++) {
        var playerUuid = nuuid.v4();
        var playerDocument = JSON.parse(JSON.stringify(gameConfig.playerConfig));
        playerDocument.currentCity = atlantaUuid;
        playerDocument.playerName = playerNames[i];
        playersDocuments.push(playerDocument);
    }

    returnObject.playersDocuments = playersDocuments;
    returnObject.playersUuids = playersUuids;

    return returnObject;
}

/**
 * @param {Object} returnObject - The returned objects
 * @param {Array} returnObject.citiesDocuments - An array of city documents for db insert
 * @param {Array} returnObject.citiesUuids - An array of city uuids
 */

/**
 * Returns an object that contains the city  documents needed for db insert
 * and the list of city uuids
 *
 * @param {String} atlantaUuid - The uuid for 'Atlanta'
 * @param {Array} playerUuids - The list of playerUuids
 */

function setupCity(atlantaUuid, playerUuids) {
    var citiesDocuments = [];
    var citiesUuids = [];
    var returnObject = {};

    for (var i = 0; i < gameConfig.cities.length; i++) {
        var cityUuid;
        var cityDocument = JSON.parse(JSON.stringify(gameConfig.cities[i]));
        if (cityDocument.name === 'Atlanta') {
            cityUuid = atlantaUuid;
            cityDocument.players = playersUuids;
        } else {
            cityUuid = nuuid.v4();
            cityDocument.players = [];
        }

        cityDocument._id = cityUuid;
        citiesDocuments.push(cityDocument);
        citiesUuids.push(cityUuid);
    }

    returnObject.citiesDocuments = citiesDocuments;
    returnObject.citiesUuids = citiesUuids;

    return returnObject;
}