
// Express package
var express = require('express');
var app = express();

//	Server initialization

var port = 4000;

var server = app.listen(port);
console.log('Listening on port ' + port);

//Request package
var request = require('request');

//Pug template package
app.set('view engine', 'pug');

// First test with API
var secret = require('./secret/api');
const API_KEY = secret.apiKey;
app.get('/steam/profile', function(httpRequest, httpResponse) {
	var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/'+'v0002/?key='+API_KEY+'&steamids=76561198006730825';
	console.log(url);
	request.get(url,function(error, steamHttpResponse, steamHttpBody) {
		httpResponse.setHeader('Content-Type', 'application/json');
		httpResponse.send(steamHttpBody);
	});
});	