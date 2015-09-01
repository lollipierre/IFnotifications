var IFapi = require('./IFapi.js');
var user = "xxxx";
var client = require('twilio')('xxxx', 'xxxx');
var sessions;

logError = function (err) {
	console.log(err);
}

processSessions = function (res, internalparams) {
	sessions = res;
	//console.log(sessions);
	for (var server of sessions) {
		getFlights(server["Name"],server["Id"]);
	}
}

getFlights = function(servername,id) {
	//console.log(id);
	IFapi.callAPI("Flights", "&sessionid=" + id + "&positionsonly=false", {"ServerName" : servername}, processFlights, logError);
}

processFlights = function(flights, internalparams) {
	for (var flight of flights) {
		if (flight.DisplayName == user) {
			var st = flight.DisplayName + " (" + flight.CallSign + ") is flying a " + flight.AircraftName;
			var st = st + " at http://maps.google.com/maps?q=" + flight.Latitude + "," + flight.Longitude;
			var st = st + " on " + internalparams["ServerName"];
			console.log(st);
			//getFlightDetails(flight.FlightID, internalparams);
			//Send an SMS text message
			client.sendMessage({
				to:'+33625555292', // Any number Twilio can deliver to
				from: '+19175515432', // A number you bought from Twilio and can use for outbound communication
				body: st // body of the SMS message
			}, function(err, responseData) { //this function is executed when a response is received from Twilio
				if (!err) { // "err" is an error received during the request, if any
					// "responseData" is a JavaScript object containing data received from Twilio.
					// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
					// http://www.twilio.com/docs/api/rest/sending-sms#example-1
					console.log(responseData.from); // outputs "+14506667788"
					console.log(responseData.body); // outputs "word to your mother."
				}
			});
		}
	}
	return;
}

getFlightDetails = function(id, internalparams) {
	IFapi.callAPI("FlightDetails", "&flightid=" + id, internalparams, processFlightDetails, logError);
}

processFlightDetails = function(flight, internalparams) {
	console.log(flight);
}

IFapi.initialize("78879b1d-3ba3-47de-8e50-162f35dc6e04");


IFapi.callAPI("getSessionsInfo", "", "", processSessions, logError);


