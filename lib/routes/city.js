// This files dictates the actions for the city end point
var _ = require('underscore');

module.exports = function(app, db) {

    var collection = db.collection('city');

    app.get('/city', function(req, res) {

        collection.find().toArray(function(err, docs) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while retrieving the city docs"
                });
            }
            return res.status(200).json({
                items: docs
            })
        });
    });

    app.get('/city/:uuid', function(req, res) {
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

    app.delete('city/:uuid', function(req, res) {
        collection.deleteOne({
            "_id": req.params.uuid
        }, function(err, doc) {
            if (!doc.result.ok)
                return res.status(500).json({
                    "message": "An error occurred while deleting the city document with the specified uuid"
                });

            return res.sendStatus(204);
        });


    });

};