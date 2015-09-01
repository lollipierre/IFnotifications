var IFapi = require('./IFapi.js');
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
		var st = flight.DisplayName + " (" + flight.CallSign + ") is flying a " + flight.AircraftName + " on " + internalparams["ServerName"];
		console.log(st);
	}
	return;
}

IFapi.initialize("78879b1d-3ba3-47de-8e50-162f35dc6e04");

IFapi.callAPI("getSessionsInfo", "", "", processSessions, logError);