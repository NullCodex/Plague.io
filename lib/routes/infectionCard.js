// This files dictates the actions for the infectionCard end point
var _ = require('underscore');

module.exports = function(app, db) {

    var collection = db.collection('infectionCard');

    app.get('/infectioncard', function(req, res) {

        collection.find().toArray(function(err, docs) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while retrieving the infectionCard docs"
                });
            }
            return res.status(200).json({
                items: docs
            })
        });
    });

    app.get('/infectioncard/:uuid', function(req, res) {
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

    app.delete('infectioncard/:uuid', function(req, res) {
        collection.deleteOne({
            "_id": req.params.uuid
        }, (function(err, doc) {
            if (!doc.result.ok)
                return res.status(500).json({
                    "message": "An error occurred while deleting the infectioncard document with the specified uuid"
                });

            return res.sendStatus(204);
        });


    });

};