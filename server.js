
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

//Mongo 
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/test';


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

//Response with render
app.get('/steam/test', function(httpRequest, httpResponse) {

	var url0 = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key='+API_KEY+'&steamids=76561198006730825';

	var url1 = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key='+API_KEY+'&account_id=46465097';

	request.get(url1, function(error, steamHttpResponse, steamHttpBody) {
		var response = JSON.parse(steamHttpBody);
		//last Match id
		var idLastM = response.result.matches[0].match_id;
		//last Match Radiant Players
		var lastMRadiantPlayer1 = response.result.matches[0].players[0];
		var lastMRadiantPlayer2 = response.result.matches[0].players[1];
		var lastMRadiantPlayer3 = response.result.matches[0].players[2];
		var lastMRadiantPlayer4 = response.result.matches[0].players[3];
		var lastMRadiantPlayer5 = response.result.matches[0].players[4];
		//last Match Dire Players
		var lastMDirePlayer1 = response.result.matches[0].players[5];
		var lastMDirePlayer2 = response.result.matches[0].players[6];
		var lastMDirePlayer3 = response.result.matches[0].players[7];
		var lastMDirePlayer4 = response.result.matches[0].players[8];
		var lastMDirePlayer5 = response.result.matches[0].players[9];
		console.log(idLastM); 
		console.log(lastMDirePlayer2);

		var insertDocument = function(db, callback) {
			db.collection('match').insertOne( {
				player: lastMRadiantPlayer5
			},function(err, result){
				assert.equal(err, null);
				callback();
			});
		};
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			insertDocument(db, function() {
				db.close();
			});
		});
	});
	request.get(url0, function(error, steamHttpResponse, steamHttpBody) {

		var response = JSON.parse(steamHttpBody);
		var personaname = response.response.players[0].personaname;
		var avatar = response.response.players[0].avatarfull;
		httpResponse.render('test', { personaname: personaname, avatar: avatar });

	});

});
app.get('/steam/test', function(httpRequest, httpResponse) {});


//convert steam 64id into 32id = var 64id - 76561197960265728 = 32id
