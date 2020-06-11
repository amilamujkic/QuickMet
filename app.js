var http = require('http');

var server= http.createServer((req,res) => {
    res.writeHead(200, {"Content-Type" : "text/plain"});
    console.log("Server running");
    res.end("QuickMet\n");
});

server.listen(5000);
