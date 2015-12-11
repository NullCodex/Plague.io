// This file is required by the app
// It sets up event listeners
// For the different URL endpoints of the application

module.exports = function(app, io, db) {

    app.get('/', function (req, res) {
        res.render('login');

    });

    app.get('/game', function (req, res) {
        res.render('main');
    });

    app.post('/adduser', function (req, res) {

        var playerName = req.body.playerName;
        var searchQuery = {};

        searchQuery["playerName"] = playerName;

        collection = db.collection('war');

        collection.find(searchQuery).toArray(function(err, docs) {
            if(docs.length != 0) {
                alert("Name is already taken!");
            } else {
                res.redirect('game');
            }
        });

    });

};