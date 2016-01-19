require('newrelic');

var app = require('express')();
var mongodb = require('mongodb');
var port = process.env.PORT || 8080;
var express = require('express');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());


const db = 'plague';

var uri = process.env.NODE_ENV === 'local' ? 'mongodb://localhost:27017/' + db : process.env.MONGOLAB_URI;
mongodb.connect(uri, {
    server: {
        auto_reconnect: true
    }
}, function(err, db) {
    if (err) {
        alert("Database could not load!");
    } else {

        app.get('/', function(req, res) {
            return res.sendStatus(204);

        });
        require('./lib/routes/game')(app, db);
        require('./lib/routes/player')(app, db);
        require('./lib/routes/city')(app, db);
        require('./lib/routes/cityCard')(app, db);
        require('./lib/routes/infectionCard')(app, db);
        require('./lib/routes/researchCentre')(app, db);
        app.listen(port);
    }

});