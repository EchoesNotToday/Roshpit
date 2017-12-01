//	Server initialization

var port = 4000;

var server = app.listen(port);
console.log('Listening on port ' + port);

// Express package
var express = require('express');
var app = express();

//Request package
var request = require('request');