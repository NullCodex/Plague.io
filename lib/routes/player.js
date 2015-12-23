// This file dictats the actions for the Player endpoints

module.exports = function(app, db) {


    var collection = db.collection('player');

    app.get('/player', function(req, res) {


        collection.find().toArray(function(err, docs) {
            if (err) {
                return res.status(500).json({
                    "message": "An error occurred while retrieving the player docs"
                });
            }
            return res.status(200).json({
                items: docs
            });
        });
    });

    app.get('/player/:uuid', function(req, res) {
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


};