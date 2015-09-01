var IFapi = require('./IFapi.js');
var sessions;

logError = function (err) {
	console.log(err);
}

processSessions = function (res) {
	sessions = res;
	//console.log(sessions);
	for (var server of sessions) {
		getFlights(server["Id"]);
	}
}

getFlights = function(id) {
	//console.log(id);
	IFapi.callAPI("Flights", "&sessionid=" + id + "&positionsonly=false", processFlights, logError);
}

processFlights = function(flights) {
	//console.log(flights);
	for (var flight of flights) {
		var st = flight.DisplayName + " (" + flight.CallSign + ") is flying a " + flight.AircraftName;
		console.log(st);
	}
	return;
}

IFapi.initialize("78879b1d-3ba3-47de-8e50-162f35dc6e04");

IFapi.callAPI("getSessionsInfo", "", processSessions, logError);