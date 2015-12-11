

var app = require('express')();
var mongodb = require('mongodb');
var port = process.env.PORT || 8080;
var express = require('express');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
const db = 'local';

var uri = process.env.NODE_ENV === 'local' ? 'mongodb://localhost:27017/'+ db : process.env.MONGOLAB_URI;
mongodb.connect(uri, {server: {auto_reconnect: true}}, function(err, db) {
  if(err) {
    alert("Database could not load!");
  } else {
    var io = require('socket.io').listen(app.listen(port));
    require('./config')(app, io, db);
    require('./routes')(app, io, db);
  }

});*/

    require('./config')(app, io, db);
    require('./routes')(app, io, db);

/*
var app = require ('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
var request = require('request');
var path = require('path');
var port = process.env.PORT || 8080;
var mongodb = require('mongodb');
var uri = process.env.MONGOLAB_URI;

var MAX_PLAYERS = 4;
var numOfPlayers = 0;


app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/main', function(req, res){

  res.sendFile(path.join(__dirname, 'views', 'main.html'));
});

app.get('/game', function(req, res){

  res.sendFile(path.join(__dirname, 'views', 'main.html'));
});


mongodb.connect(uri, {server: {auto_reconnect: true }}, function (err, db) {
if(err)
{
  console.log("Database failed.");
}
else
{

      db.collection("messages").insert(
      {
        chatId: id
      }
    )

      var io = require('socket.io').listen(app.listen(port));

      // Require the configuration and the routes files, and pass
      // the app and io as arguments to the returned functions.

      require('./config')(app, io, db);
      require('./routes')(app, io, db);
      console.log('The application is running on http://localhost:' + port);
}

function initialize() {
    server.listen(port);
    //var host = server.address().address;
    //var port = server.address().port;

    //console.log('Application started at http://%s:%s', host, port);
}

initialize();

io.on('connection', function(socket) {
    console.log("A connection established");

    socket.on('zap', function(data) {
        console.log('zapped');
        console.log(data);
        //io.emit('zapper');
    });

    socket.on('playerentry', function(data){
        if (numOfPlayers < MAX_PLAYERS){
            console.log(data)
            numOfPlayers+=1;
        }
    });

});

*/