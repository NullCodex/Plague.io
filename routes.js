// This file is required by the app
// It sets up event listeners
// For the different URL endpoints of the application

module.exports = function(app, db) {

    app.get('/', function (req, res) {
        res.sendStatus(204);

    });

};