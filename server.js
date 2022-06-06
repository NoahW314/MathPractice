'use strict';
const http = require('http');
const fs = require('fs');
const browserify = require('browserify');
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
    else if (url === "/bundle.js") {
        response.writeHeader(200, { "Content-Type": "text/javascript" });
        var bundle = browserify();
        bundle.add(__dirname + "/processing.js");
        bundle.bundle().pipe(response);
    }
    else if (url.endsWith(".js")) {
        console.log(url);
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
    else if (url === "/favicon.ico") {
        response.writeHeader(200, { "Content-Type": "image/x-icon" });
        var favicon;
        try {
            favicon = fs.readFileSync('./favicon.ico');
        } catch (err) {
            console.log(err);
        }
        response.write(favicon);
        response.end();
    }
    else if (url === "/test") {
        response.statusCode = 200;
        response.end();
        // insert random (disconnected) code to test here

    }
    else {
        response.statusCode = 404;
        response.end();
    }
}).listen(port);