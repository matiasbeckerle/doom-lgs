// Required modules
var querystring = require("querystring");
var http = require("http");

var Kolog = (function () {
	
	var settings = {
		host: "kolog.herokuapp.com",
	    port: 80,
	    path: "/logs/_e48is7pjh"
	};
	
	var info = function (message) {
		log("INFO", message);
	};

	function log(level, message) {		
		var data = querystring.stringify({
			traceLevel: level,
			message: message
	    });
		
		var options = {
		    host: settings.host,
		    port: settings.port,
		    path: settings.path,
		    method: "POST",
		    headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		        "Content-Length": Buffer.byteLength(data)
		    }
		};
		
		var req = http.request(options, function(res) {
		    res.setEncoding("utf8");
		    res.on("data", function (chunk) {
		        console.log("body: " + chunk);
		    });
		});
		
		req.write(data);
		req.end();
	}

	return {
		settings: settings,
		info: info
	};

})();
module.exports = Kolog;