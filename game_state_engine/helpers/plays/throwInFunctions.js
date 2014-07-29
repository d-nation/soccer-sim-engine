(function() {
    "use strict";

    var helpers = require("../../helpers/helperFunctions.js");

    module.exports = {
        getVectors: function (game) {
            var ballVerticalDirection = 1,
                ballVerticalDistance = 0,
                ballHorizontalDirection = 1,
                ballHorizontalDistance = 0;

            //Determine pass horizontal direction
            ballHorizontalDirection = this.determineHorizontalDirection(game);

            //Determine pass horizontal distance
            ballHorizontalDistance = this.determineHorizontalDistance(game, ballHorizontalDirection);

            //Determine pass vertical direction
            ballVerticalDirection = this.determineVerticalDirection(game);

            //Determine pass vertical distance
            ballVerticalDistance = this.determineVerticalDistance(game, ballVerticalDirection);

            return {
                ballHorizontalDirection: ballHorizontalDirection,
                ballHorizontalDistance: ballHorizontalDistance,
                ballVerticalDirection: ballVerticalDirection,
                ballVerticalDistance: ballVerticalDistance
            };
        },

        determineHorizontalDirection: function (game) {
            var pitch = game.get("pitch"),
                ballHorizontalDirection;

            if (pitch.current[0] === 1) { //can't go any further left
                //50% chance of going back or level
                if (helpers.randomIntFromInterval(1, 10) > 5) {
                    //Level
                    ballHorizontalDirection = 0;
                } else {
                    //Going back to the right
                    ballHorizontalDirection = 1;
                }
            } else if (pitch.current[0] === 8) { //can't go any further right
                //90% chance of going forward
                if (helpers.randomIntFromInterval(1, 10) > 1) {
                    //Going to the left
                    ballHorizontalDirection = -1;
                } else {
                    //level
                    ballHorizontalDirection = 0;
                }
            } else { //normal play
                //33% chance of going forward
                if (helpers.randomIntFromInterval(1, 9) > 6) {
                    //Going to the left
                    ballHorizontalDirection = -1;

                    //33% chance of going back
                } else if (helpers.randomIntFromInterval(1, 9) > 6) {
                    //Going to the left
                    ballHorizontalDirection = 1;

                    //33% chance of passing sideways
                } else {
                    //staying level
                    ballHorizontalDirection = 0;
                }
            }

            if (pitch.current[0] === 8){ //can't go any further right
                //50% chance of going back or level
                if (helpers.randomIntFromInterval(1, 10) > 5){
                    //Level
                    ballHorizontalDirection = 0;
                } else {
                    //Going back to the left
                    ballHorizontalDirection = -1;
                }
            } else if (pitch.current[0] === 1){ //can't go any further left
                //90% chance of going forward
                if (helpers.randomIntFromInterval(1, 10) > 1){
                    //Going to the right
                    ballHorizontalDirection = 1;
                } else {
                    //level
                    ballHorizontalDirection = 0;
                }
            } else { //normal play
                //33% chance of going forward
                if (helpers.randomIntFromInterval(1, 9) > 6){
                    //Going to the left
                    ballHorizontalDirection = -1;

                 //33% chance of going back
                } else if (helpers.randomIntFromInterval(1, 9) > 6){
                    //Going to the left
                    ballHorizontalDirection = 1;

                //33% chance of passing sideways
                } else {
                    //staying level
                    ballHorizontalDirection = 0;
                }
            }

            return ballHorizontalDirection;
        },

        determineHorizontalDistance: function(game, direction){
            return helpers.randomIntFromInterval(0, 1);
        },

        determineVerticalDirection: function(game) {
            var pitch = game.get("pitch"),
                ballVerticalDirection = 1;

            if (pitch.current[1] === 6) {
                ballVerticalDirection = -1;
            }

            return ballVerticalDirection;
        },

        determineVerticalDistance: function(game, direction){
            return helpers.randomIntFromInterval(0, 1);
        }
    };
})();