(function() {
    "use strict";

    var helpers = require("../../helpers/helperFunctions.js"),

        calculatePlayTime = function(){
            //TODO: upgrade to use a weighted distribution
            return helpers.randomIntFromInterval(1,10);
        };

    module.exports = {

        "addPlayTime": function(){
            var currentTime = this.get("time"),
                currentMinute = parseInt(currentTime.substr(0, currentTime.indexOf(":"))),
                currentSecond = parseInt(currentTime.substr(currentTime.indexOf(":")+1)),
                timeToAdd = calculatePlayTime(),
                newSecond = currentSecond + timeToAdd;

            //correct for the minute flip
            if (newSecond >= 60){
                this.set("time", helpers.formatTime(currentMinute + 1, newSecond - 60));
            } else {

                this.set("time", helpers.formatTime(currentMinute, newSecond));
            }
        },

        "isEndOfHalf": function(){
            var currentTime = this.get("time"),
                half = this.get("half"),
                stoppageTime = this.get("stoppageTime"),
                currentMinute = parseInt(currentTime.substr(0, currentTime.indexOf(":"))),
                currentSecond = parseInt(currentTime.substr(currentTime.indexOf(":")+1)),
                halfEnd = 45;

            //Adjust the half end time for the 2nd half
            if (half === 2){
                halfEnd = 90;
            }

            //End the half if the minute exceeds the halfEnd + stoppage
            if ((currentMinute - halfEnd) > stoppageTime){
                return true;
            }

            //33% chance of ending the half if within 60seconds of halfEnd + stoppage
            if ((currentMinute - halfEnd) === stoppageTime && currentSecond <= 30 &&
                    helpers.randomIntFromInterval(1,3)===1){
                return true;
            }

            //50% chance of ending the half if within 30seconds of halfEnd + stoppage
            return ((currentMinute - halfEnd) === stoppageTime &&
                currentSecond > 30 &&
                helpers.randomIntFromInterval(1, 2) === 1);
        },

        "resetFor2ndHalf": function(){
            //reset time
            this.set("time", helpers.formatTime(45, 0));

            //switch the half
            this.set("half", 2);

            //make the next play a kickoff
            this.get("pitch").status = 0;
        },

        "isTimeForStoppageCalc": function(){
            var currentTime = this.get("time"),
                half = this.get("half"),
                stoppageTime = this.get("stoppageTime"),
                currentMinute = parseInt(currentTime.substr(0, currentTime.indexOf(":")));

            if (!stoppageTime){
                //Nearing the end of the 1st half
                if (half === 1 && currentMinute === 43){
                    return true;
                } else {
                    //Nearing the end of the 2nd half
                    return (half === 2 && currentMinute === 88);
                }
            }

            return false;
        },

        "setStoppageTime": function(){
            //TODO Adjust for any injuries or cards
            this.set("stoppageTime", helpers.randomIntFromInterval(1, 5));
        }
    };
}());