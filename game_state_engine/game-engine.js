var mqContext = require("rabbit.js").createContext("amqp://localhost");
var async = require("async");
var fs = require("fs");
var GameState = require("./models/gameState"),
    _ = require("underscore")._;
var gameFuncs = require("./helpers/gameFunctions");
var file = __dirname + "/game.json";
var gameObj = {},
    worker, push;

mqContext.on("ready", function(){

    console.log("Listening for games...");
    worker = mqContext.socket("WORKER");
    push = mqContext.socket("PUSH");

    async.series({
        "startPush": function(next){
            push.connect("games", function(){
                next();
            });
        },
        "startWorker": function(next){
            worker.connect("games", function(){
                worker.setEncoding("utf8");
                worker.on("data", function(data){
                    gameObj = JSON.parse(data);
                    processGame(gameObj);
                });
            });
        }
    });
});

function processGame(gameObj){
    var thisPlay = null,
        gameState = new GameState(gameObj.game);

    async.series({
        "gameFlow": function(next){
//            console.log("Starting Cycle...");
//            console.log("Clock: " + gameState.get("time"));
            //Is it the end of the first half?
            if(gameState.get("half") === 1 && gameState.clock.isEndOfHalf()){

                console.log("*****End of 1st Half*****");
                gameState.clock.resetFor2ndHalf();


            //Is it the end of the game?
            } else if (gameState.get("half") === 2 && gameState.clock.isEndOfHalf()){

                console.log("*****End of 2nd Half*****");
                gameState.set("time", "Final");
                console.log("Final Score - Home: " + gameState.get("score").home + " Away: " + gameState.get("score").away);
            } else {
//                console.log("Possession: " + gameState.get("possession").current);

                //Determine if previous play was successful
                gameState.plays.calculatePlaySuccess();

                //Determine this play (go to the decision tree)
                thisPlay = gameState.plays.determinePlay();
                gameState.set("previousPlay", thisPlay);

                gameState.plays.logPlayType(thisPlay);

                //Determine new ball location
                gameState.plays.calculateNewPitchLocation();
//                gameState.plays.logBallLocation();



                //Run time off of the clock
                gameState.clock.addPlayTime();

                //Set stoppage time if its near the end of the half
                if (gameState.clock.isTimeForStoppageCalc()){
                    gameState.clock.setStoppageTime();
                }
            }
            next();
        },
        "acknowledgeMessage": function(next){
            worker.ack();
            next();
        },
        "rePostToQueue": function(next){
            if(gameState.get("time") !== "Final"){
                gameObj.game = gameState.toJSON();
                push.write(JSON.stringify(gameObj), "utf-8");
            }
            next();
        }
    });
}