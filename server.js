// Require modules
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));
    
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.listen(666, function(){
    console.log("Listening on *:666"); // Appropriate port number for Doom related, right?
});
