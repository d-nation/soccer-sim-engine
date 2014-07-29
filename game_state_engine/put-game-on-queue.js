
var mqContext = require("rabbit.js").createContext("amqp://localhost");
var fs = require("fs");
var async = require("async");
//var gameFuncs = require("./helpers/gameFunctions");
var file = __dirname + "/game.json";
var gameObj = {},
    push;

function start(next){
    "use strict";

    async.series({
        getGameObj: function(next){
            fs.readFile(file, "utf8", function (err, data) {
                if (err) {
                    console.log("Error: " + err);
                    return;
                }

                gameObj = JSON.parse(data);

                console.log("Got Game Obj!");
                next();
            });
        },
        setupQueueConnection: function(next){
            console.log("Setting up queue connection");
            mqContext.on("ready", function(){

                console.log("Queue ready for writing");
                push = mqContext.socket("PUSH");

                push.connect("games", function(){
                    next();
                });
            });
        },
        writeGameToQueue: function(next){
            console.log("Writing to queue");
            push.write(JSON.stringify(gameObj), "utf-8");
            next();
        },
        closeQueueConnection: function(next){
            console.log("Closing connection to queue");
            // wait til the next tick before closing
            setImmediate(function(){
                mqContext.close();
            });
        }

    }, function(err, results){
        console.log(results);
    });
}
start();


