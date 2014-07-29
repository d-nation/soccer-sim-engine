(function() {
    "use strict";

    var helpers = require("../../helpers/helperFunctions.js"),
        passingFuncs = require("./passingFunctions.js"),
        throwInFuncs = require("./throwInFunctions.js"),
        shotFuncs = require("./shotFunctions.js"),

        playEnumeration = {
            0: "Kickoff",
            1: "Pass",
            2: "Move With Ball",
            3: "Shot",
            4: "Foul",
            5: "Free Kick",
            6: "Throw In",
            7: "Goal Kick",
            8: "Corner Kick",
            9: "Penalty Kick",
            10: "Goal",
            11: "Out of Touch (ThrowIn)",
            12: "Out of Touch (GoalKick)"
        };

    module.exports = {
        "determinePlay": function(){
            var randomNum = 0,
                temp = this.get("pitch"),
                pitch = temp.current,
                status = temp.status;

            //If it's an opening or post-goal kickoff
            if (status === 0 || (this.get("previousPlay") && this.get("pitch").status === 7 && this.get("previousPlay") === 10)) {
                return 0;
            }

            //Following a Goal
            if (status === 7) {

                //Goal
                return 10;
            }

            //Following an Out of Touch (ThrowIn)
            if (status === 3){
                return 11;
            }

            //Following an Out of Touch (GoalKick)
            if (status === 9){
                return 12;
            }

            //If its in play

            //Following a Kickoff
            if (this.get("previousPlay") === 0){
                return 1;

            //Following a Foul
            } else if (this.get("previousPlay") === 4){

                //Free Kick
                return 5;

            //Following an Out of Touch(ThrowIn)
            } else if (this.get("previousPlay") === 11){

                //ThrowIn
                return 6;

            //Following an Out of Touch(GoalKick)
            } else if (this.get("previousPlay") === 12){

                //GoalKick
                return 7;

            //Following anything else
            } else {

                //Shot
                if (shotFuncs.doesPlayerShoot(this)){
                    this.set("previousPlay", 3);
                    return 3;
                }

                //Pass or Move with ball (Pass: 50%, Move: 50%
                randomNum = helpers.randomIntFromInterval(1,11);
                if (randomNum <= 6) {
                    this.set("previousPlay", 1);
                    return 1;
                } else {
                    this.set("previousPlay", 2);
                    return 2;
                }
            }

        },

        "logPlayType": function(play){
            console.log(this.get("time") + ": " + playEnumeration[play]);
        },

        "calculateNewPitchLocation": function(){
            var pitch = this.get("pitch"),
                half = this.get("half"),
                possession = this.get("possession"),
                previousPlay = this.get("previousPlay"),
                ballVectors = {};

            //If its an opening or post-goal kickoff
            if (pitch.status === 0 || (this.get("pitch").status === 7 && this.get("previousPlay") === 10)){
                pitch.current = [5,4];
            }

            //If previous play was a pass or goalkick
            if (previousPlay === 1 || previousPlay === 7){
                ballVectors = passingFuncs.getVectors(this);

                pitch.current = [pitch.current[0] + (ballVectors.ballHorizontalDirection * ballVectors.ballHorizontalDistance),
                                pitch.current[1] + (ballVectors.ballVerticalDirection * ballVectors.ballVerticalDistance)];

            //TODO If previous play was Moving with the Ball
            } else if (previousPlay === 2) {


            //If previous play was a throw-in
            } else if (previousPlay === 6) {
                ballVectors = throwInFuncs.getVectors(this);

                pitch.current = [pitch.current[0] + (ballVectors.ballHorizontalDirection * ballVectors.ballHorizontalDistance),
                                pitch.current[1] + (ballVectors.ballVerticalDirection * ballVectors.ballVerticalDistance)];

            //If previous play was an out of touch (goalkick)
            } else if (previousPlay === 12) {

                if ((possession.current === 1 && half === 1) || (possession.current === 2 && half === 2)){
                    pitch.current = [8,4];
                } else {
                    pitch.current = [1,3];
                }

            //If previous play was a shot
            }/* else if (previousPlay === 3){
                pitch.current = shotFuncs.determineSavedBallLocation(this);
            }*/

            //Everything else
            pitch.status = 1;

        },

        logBallLocation: function(){
            console.log("Ball now at: " + this.get("pitch").current);
        },

        calculatePlaySuccess: function(){
            var possession = this.get("possession"),
                half = this.get("half"),
                previousPlay = this.get("previousPlay"),
                score = this.get("score"),
                tempPitch = this.get("pitch"),
                shotOnTarget = false;

            //Passing & goal-kick success calculations
            if (previousPlay === 1 || previousPlay === 7) {
                //
                //50% chance of turnover
                if (helpers.randomIntFromInterval(1, 10) <= 5) {
                    if (possession.current === 1) {
                        possession.current = 2;
                    } else if (possession.current === 2) {
                        possession.current = 1;
                    }
                }

                //25% chance of ball going out of bounds if passed to top/bottom
                // (This is applied whether the pass was turned over or not)
                if ((tempPitch.current[1] === 1 || tempPitch.current[1] === 6) &&
                    helpers.randomIntFromInterval(1, 12) <= 3){

                    if (possession.current === 1) {
                        possession.current = 2;
                    } else if (possession.current === 2) {
                        possession.current = 1;
                    }

                    tempPitch.status = 3;
                    this.set("pitch", tempPitch);
                }

                //60% chance of ball going out of bounds if passed to far left/right
                // (This is applied whether the pass was turned over or not)
                if ((tempPitch.current[0] === 1 || tempPitch.current[0] === 8) &&
                    helpers.randomIntFromInterval(1, 10) <= 6){

                    //Goal Kick
                    //From left
                    if (tempPitch.current[0] === 1) {
                        if (half === 1) {
                            possession.current = 2;
                        } else {
                            possession.current = 1;
                        }

                        tempPitch.status = 9;
                        this.set("pitch", tempPitch);

                    //From right
                    } else {
                        if (half === 1) {
                            possession.current = 1;
                        } else {
                            possession.current = 2;
                        }

                        tempPitch.status = 9;
                        this.set("pitch", tempPitch);
                    }
                }

            //Move With Ball success calculations
            } else if (previousPlay === 2) {
                //TODO Out of Bounds
                //50% chance of turnover
                if (helpers.randomIntFromInterval(1, 10) <= 5) {
                    if (possession.current === 1) {
                        possession.current = 2;
                    } else if (possession.current === 2) {
                        possession.current = 1;
                    }
                }

            //ThrowIn success calculations
            } else if (previousPlay === 6) {

                //40% chance of turnover
                if (helpers.randomIntFromInterval(1, 10) <= 4) {
                    if (possession.current === 1) {
                        possession.current = 2;
                    } else if (possession.current === 2) {
                        possession.current = 1;
                    }
                }

            //Shooting success calculations
            } else if (previousPlay === 3 && this.get("pitch").status !== 7){
                shotOnTarget = shotFuncs.isShotOnTarget(this);

                //TODO Scoring/Saves/Rebounds
                //If shot is on target, 20% chance of a goal
                if (shotOnTarget && helpers.randomIntFromInterval(1, 10) < 3) {

                    //Register the goal
                    tempPitch.status = 7;
                    this.set("pitch", tempPitch);

                    //Change the score
                    if (possession.current === 1) {
                        score.home += 1;
                    } else {
                        score.away += 1;
                    }

                    this.plays.logGoal();
                } else if (!shotOnTarget){

                    //Goal Kick
                    //From left
                    if (tempPitch.current[0] === 1) {
                        if (half === 1) {
                            possession.current = 2;
                        } else {
                            possession.current = 1;
                        }

                        tempPitch.status = 9;
                        this.set("pitch", tempPitch);

                    //From right
                    } else {
                        if (half === 1) {
                            possession.current = 1;
                        } else {
                            possession.current = 2;
                        }

                        tempPitch.status = 9;
                        this.set("pitch", tempPitch);
                    }
                }


                //Change possession
                if (possession.current === 1) {
                    possession.current = 2;
                } else if (possession.current === 2) {
                    possession.current = 1;
                }
            }
        },

        logGoal: function(){
            console.log("!!!!!Goal!!!! Score: " + this.get("score").home + "-" + this.get("score").away);
        }
    };
}());