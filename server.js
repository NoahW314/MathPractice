'use strict';
const http = require('http');
const fs = require('fs');
var port = process.env.PORT || 1337;


http.createServer(function (request, response) {
    const url = request.url;
    console.log(url);
    if (url === "/") {
        response.writeHeader(200, { "Content-Type": "text/html" });
        var html;
        try {
            html = fs.readFileSync('./index.html');
        } catch (err) {
            console.log(err);
        }
        response.write(html);
        response.end();
    }
    else if (url.endsWith(".js")) {
        response.writeHeader(200, { "Content-Type": "text/javascript" });
        var jsFile;
        try {
            jsFile = fs.readFileSync("." + url);
        } catch (err) {
            console.log(err);
        }
        response.write(jsFile);
        response.end();
    }
    // TODO: add an icon via favicon.ico?
    else {
        response.writeHeader(200, { "Content-Type": "text/plain" });
        response.end("");
    }
}).listen(port);