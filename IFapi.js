var http = require('http');
var apiKey;
var apiBaseUrl = "http://infinite-flight-public-api.cloudapp.net/v1/";
var apiEndPoints = {
	"getSessionsInfo" : "GetSessionsInfo.aspx",
	"Flights": "Flights.aspx",
	"FlightDetails": "FlightDetails.aspx",
	"GetATCFacilities": "GetATCFacilities.aspx",
	"UserDetails": "UserDetails.aspx"
};
var getSessionsInfoUrl = "GetSessionsInfo.aspx";

exports.initialize = function(k) {
	apiKey = k;
}

exports.showKey = function() {
	return apiKey;
}

exports.callAPI = function(endpoint, params, internalparams, callback, err) {
	if (apiKey == undefined) {
		err("You need to init the api key first!");
		return;
	}
	
	if (apiEndPoints[endpoint] == undefined) {
		err("Api endpoint: " + endpoint + " doesn't exist...");
		return;
	}
	
	if (params == undefined) {
		err("Missing params!");
		return;
	}
	
	if (internalparams == undefined) {
		err("Missing internal params!");
		return;
	}
	
	http.get(apiBaseUrl + apiEndPoints[endpoint] + "?apikey=" + apiKey + params, function(res) {
  		var body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            var parsed = JSON.parse(body);
			callback(parsed, internalparams);
        });
	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
		err(e.message);
		return;
	});
}