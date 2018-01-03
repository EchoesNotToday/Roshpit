
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
var all_match = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key='+API_KEY+'&account_id=76561198006730825';

var last_100_match_gold_minute = [];
var match_details = [];
var result_last_100_match_id = [];
var id = "";
function get_100_last_match_id_to_details(res) {

	request.get(all_match, function(error, steamHttpResponse, steamHttpBody) {
		
		var response = JSON.parse(steamHttpBody);

		var total_number_matches = response.result.total_results;
		
		var num_of_match = response.result.matches;

		for (var i = 0; i<= num_of_match.length-1; i++) {

			result_last_100_match_id.push(num_of_match[i].match_id);
			
			var match_ids = num_of_match[i].match_id;

			
			match_details.push('http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key='+API_KEY+'&match_id=' + match_ids);

		}	

		get_details_100_last_matches(match_details, 0, res);

	});

}

function get_details_100_last_matches(match_details, i, res) {
	
	if (i<= match_details.length-1) {
		
		request.get(match_details[i], function(error, steamRes, steamBody) {

			if(steamBody !== undefined) {

				var response2 = JSON.parse(steamBody);
				
				var gold_per_min = response2.result.players[0].gold_per_min;
				
				last_100_match_gold_minute.push(gold_per_min);	

			}
			
			i++;
			
			get_details_100_last_matches(match_details, i, res);

		});

	}
	
	else res.render('test', { personaname : last_100_match_gold_minute });

}


app.get('/steam/test3', function(req, res) {

	get_100_last_match_id_to_details(res);
	var last_100_match_gold_minute = [];
	var match_details = [];
	
});


function get_100_last_ids(res) {
	var get_100_last = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key='+API_KEY+'&account_id=76561198006730825';
	var array_match_id = [];

	request.get(get_100_last, function(err, response, request) {
		var q = JSON.parse(request);
		var last_ids = q.result.matches;

		for(i = 0; i < last_ids.length; i++) {

			array_match_id.push(last_ids[i].match_id);
		}

		last_id = array_match_id[array_match_id.length - 1]
		get_all_matches_id_2_le_retour_de_la_vengeance(array_match_id, res);
	});
}

function get_all_matches_id_2_le_retour_de_la_vengeance(result_match_id, res) {

	var tmp = result_match_id
	var last_id = tmp[tmp.length - 1]
	var get_100_more = 'http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key='+API_KEY+'&account_id=76561198006730825&start_at_match_id='+last_id;

	request.get(get_100_more, function(err, ress, req) {
		var resp = JSON.parse(req);
		var num_of_match = resp.result.matches;

		for(i = 1; i < num_of_match.length; i ++) {

			tmp.push(num_of_match[i].match_id);
		}

		last_id = tmp[result_match_id.length - 1]
		
		if(num_of_match.length == 100){

			console.log(last_id)
			get_all_matches_id_2_le_retour_de_la_vengeance(tmp, res);
		}
		console.log(tmp.length);
	});
}

function details_all_matches() {

}

app.get('/steam/test4', function(req, res) {
	get_100_last_ids(res);
	// get_number_of_matches();
	// console.log(result_match_id);

});
