const db = require('./serverUtils/database');
const prompt = require('prompt-sync');
const express = require('express');
const listeningPort = 2000;

function continueStartup() {
    var app = express();
    var serv = require('http').Server(app);
    
    app.get('/',function(req, res) {
        res.sendFile(process.cwd() + "/html/index.html");
    });
    
    serv.listen(listeningPort);
    console.log("Server running at http://localhost:"+listeningPort);
}

async function startup() {
    console.log("Starting server...");
    await db.initialiseDb();
    continueStartup();
}

startup();