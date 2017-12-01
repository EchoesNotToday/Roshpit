
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

app.get('/steam/test', function(httpRequest, httpResponse) {
	
	var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key='+API_KEY+'&steamids=76561198006730825';

	request.get(url, function(error, steamHttpResponse, steamHttpBody) {

		var response = JSON.parse(steamHttpBody);
		var personaname = response.response.players[0].personaname;
		var avatar = response.response.players[0].avatarfull;
		httpResponse.render('test', { personaname: personaname, avatar: avatar });
	
	});

});
app.get('/steam/test', function(httpRequest, httpResponse) {

	var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key='+API_KEY+'&steamids=46465097'

	request.get(url, function(error, steamHttpResponse, steamHttpBody) {

		var response = JSON.parse(steamHttpBody);
		
	});
});