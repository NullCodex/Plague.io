// This files dictates the actions for the researchcentre end point
var nuuid = require('node-uuid'),
    _ = require('underscore'),
    gameConfig = require('../../config/gameConfig');

module.exports = function(app, db) {

    var collection = db.collection('researchCentre');

    app.get('/researchcentre', function(req, res) {

        collection.find().toArray(function(err, docs) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while retrieving the researchCentre docs"
                });
            }
            return res.status(200).json({
                items: docs
            })
        });
    });

    app.get('/researchcentre/:uuid', function(req, res) {
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

    app.post('/researchcentre', function(req, res) {
        var researchCentreUuid = nuuid.v4();
        var documentBody = {};
        documentBody._id = researchCentreUuid;

        collection.insertOne(documentBody, function(err, r) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while creating the researchCentre document"
                });
            }

            return res.status(201).location("http://plague-io.herokuapp.com/researchcentre/" + researchCentreUuid).send('The researchcentre has been created');
        });
    });

    app.delete('/researchcentre/:uuid', function(req, res) {
        collection.deleteOne({
            "_id": req.params.uuid
        }, function(err, doc) {
            if (!doc.result.ok)
                return res.status(500).json({
                    "message": "An error occurred while deleting the researchcentre document with the specified uuid"
                });

            return res.sendStatus(204);
        });

    });

};