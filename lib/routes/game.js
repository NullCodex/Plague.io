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

        // variable used for POST game
        var playerNames = req.body.players;
        var washingtonUuid = nuuid.v4();
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
        postPlayerSetup = setupPlayer(playerNames, washingtonUuid, postCityCardsSetup.cityCardsUuids);
        postCitySetup = setupCity(washingtonUuid, postPlayerSetup.playersUuids);

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
 * @param {Array} array - The shuffled shuffled array
 */

/**
 * Returns a shuffled array
 *
 * @param array - The array to shuffle
 */

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

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

    var shuffledCityCardsUuids = shuffle(cityCardsUuids);
    returnObject.cityCardsdDocuments = cityCardsdDocuments;
    returnObject.cityCardsUuids = shuffledCityCardsUuids;

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

    var shuffledInfectionCardsUuids = shuffle(infectionCardsUuids);
    returnObject.infectionCardsdDocuments = infectionCardsdDocuments;
    returnObject.infectionCardsUuids = shuffledInfectionCardsUuids;

    return returnObject;
}

/**
 * @param {Object} returnObject - The returned objects
 * @param {Array} returnObject.playersDocuments - An array of players documents for db insert
 * @param {Array} returnObject.playersUuids - An array of players uuids
 * @param {Array} returnObject.playerCardsAssociation - An array of player and cards association
 */

/**
 * Returns an object that contains the players documents needed for db insert
 * and the list of players uuids
 *
 * @param {Array} playerNames - An array of player names such as ['Tim']
 * @param {String} washingtonUuid - The uuid for 'washington'
 * @param {Array} shuffledCards - An array of the list of cityCards uuids
 */

function setupPlayer(playerNames, washingtonUuid, shuffledCards) {
    var playersDocuments = [];
    var playersUuids = [];
    var playerCardsAssociation = [];
    var playerCardMap = new Map();

    for(var i = 0; i < cityCards.length; i++) {
        playerCardMap.set(cityCards[i], i);
    }

    var returnObject = {};

    for (var i = 0; i < playerNames.length; i++) {
        var playerHand = [];
        var playerUuid = nuuid.v4();
        var playerDocument = JSON.parse(JSON.stringify(gameConfig.playerConfig));
        playerDocument.currentCity = washingtonUuid;
        playerDocument.playerName = playerNames[i];
        playerDocument._id = playerUuid;
        playersUuids.push(playerUuid);

        for(var j = 0; j < 7; j++) {
            var cityCardPopped = shuffledCards.pop();
            console.log(cityCardPopped);
            playerDocument.cards.push(cityCardPopped);
            playerHand.push(playerCardMap.get(cityCardPopped));

        }
        playerCardsAssociation.push({playerName: playerNames[i], hand: playerHand});
        playersDocuments.push(playerDocument);
    }

    returnObject.playersDocuments = playersDocuments;
    returnObject.playersUuids = playersUuids;
    returnObject.playerCardsAssociation = playerCardsAssociation;

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
 * @param {String} washingtonUuid - The uuid for 'Washington'
 * @param {Array} playerUuids - The list of playerUuids
 */

function setupCity(washingtonUuid, playerUuids) {
    var citiesDocuments = [];
    var citiesUuids = [];
    var returnObject = {};

    for (var i = 0; i < gameConfig.cities.length; i++) {
        var cityUuid;
        var cityDocument = JSON.parse(JSON.stringify(gameConfig.cities[i]));
        if (cityDocument.name === 'Washington D.C.') {
            cityUuid = washingtonUuid;
            cityDocument.players = playerUuids;
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