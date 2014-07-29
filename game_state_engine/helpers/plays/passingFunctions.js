(function() {
    "use strict";

    var helpers = require("../../helpers/helperFunctions.js");

    module.exports = {
        getVectors: function(game){
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

        determineHorizontalDirection: function(game){
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession").current,
                previousPlay = game.get("previousPlay"),
                ballHorizontalDirection = 1;

            //Team going from right to left
            if ((possession === 1 && half === 1) || (possession === 2 && half === 2)){
                //Goalkick
                if (previousPlay === 7) {
                    ballHorizontalDirection = -1;

                //Pass
                } else if (pitch.current[0] === 1){ //can't go any further left
                    //50% chance of going back or level
                    if (helpers.randomIntFromInterval(1, 10) > 5){
                        //Level
                        ballHorizontalDirection = 0;
                    } else {
                        //Going back to the right
                        ballHorizontalDirection = 1;
                    }
                } else if (pitch.current[0] === 8){ //can't go any further right
                    //90% chance of going forward
                    if (helpers.randomIntFromInterval(1, 10) > 1){
                        //Going to the left
                        ballHorizontalDirection = -1;
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

            //Team going from left to right
            } else {
                //Goalkick
                if (previousPlay === 7) {
                    ballHorizontalDirection = 1;

                //Pass
                } else if (pitch.current[0] === 8){ //can't go any further right
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
            }

            return ballHorizontalDirection;
        },

        determineHorizontalDistance: function(game, direction){
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession"),
                previousPlay = game.get("previousPlay"),
                newX,
                ballHorizontalDistance = 1;

            //Goalkick
            if (previousPlay === 7) {
                ballHorizontalDistance = helpers.randomIntFromInterval(2, 6);

                return ballHorizontalDistance;
            }

            //Level pass
            if (!direction) {
                return 0;
            }

            //Pass: If the ball is going left
            if (direction === -1){
                newX = helpers.randomIntFromInterval(1, pitch.current[0]);
                ballHorizontalDistance = pitch.current[0] - newX;

            //Pass: If the ball is going right
            } else {
                newX = helpers.randomIntFromInterval(pitch.current[0], 8);
                ballHorizontalDistance = 8 - newX;
            }


            return ballHorizontalDistance;
        },

        determineVerticalDirection: function(game) {
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession").current,
                previousPlay = game.get("previousPlay"),
                ballVerticalDirection = 1;

            //Team going from right to left
            if ((possession === 1 && half === 1) || (possession === 2 && half === 2)){
                if (pitch.current[1] === 1){ //can't go any further up
                    //50% chance of going down or straight
                    if (helpers.randomIntFromInterval(1, 10) > 5){
                        //Straight
                        ballVerticalDirection = 0;
                    } else {
                        //Going back down
                        ballVerticalDirection = 1;
                    }
                } else if (pitch.current[1] === 6){ //can't go any further down
                    //50% chance of going up or straight
                    if (helpers.randomIntFromInterval(1, 10) > 5){
                        //Going up
                        ballVerticalDirection = -1;
                    } else {
                        //Straight
                        ballVerticalDirection = 0;
                    }
                } else { //normal play
                    //33% chance of going up
                    if (helpers.randomIntFromInterval(1, 9) > 6){
                        //Going to the left
                        ballVerticalDirection = -1;

                     //33% chance of going down
                    } else if (helpers.randomIntFromInterval(1, 9) > 6){
                        //Going to the left
                        ballVerticalDirection = 1;

                    //33% chance of passing straight
                    } else {
                        //staying level
                        ballVerticalDirection = 0;
                    }
                }

            //Team going from left to right
            } else {
                if (pitch.current[1] === 6){ //can't go any further down
                    //50% chance of going up or straight
                    if (helpers.randomIntFromInterval(1, 10) > 5){
                        //Straight
                        ballVerticalDirection = 0;
                    } else {
                        //Going back to the top
                        ballVerticalDirection = -1;
                    }
                } else if (pitch.current[1] === 1){ //can't go any up
                    //50% chance of going down or straight
                    if (helpers.randomIntFromInterval(1, 10) > 5){
                        //Going to the right
                        ballVerticalDirection = 1;
                    } else {
                        //straight
                        ballVerticalDirection = 0;
                    }
                } else { //normal play
                    //33% chance of going up
                    if (helpers.randomIntFromInterval(1, 9) > 6){
                        //Going to the left
                        ballVerticalDirection = -1;

                     //33% chance of going down
                    } else if (helpers.randomIntFromInterval(1, 9) > 6){
                        //Going to the left
                        ballVerticalDirection = 1;

                    //33% chance of passing straight
                    } else {
                        //staying level
                        ballVerticalDirection = 0;
                    }
                }
            }

            return ballVerticalDirection;
        },

        determineVerticalDistance: function(game, direction){
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession"),
                previousPlay = game.get("previousPlay"),
                newY,
                ballHorizontalDistance = 1;

            //Straight pass
            if (!direction) {
                return 0;
            }

            //If the ball is going up
            if (direction === -1){
                newY = helpers.randomIntFromInterval(1, pitch.current[1]);
                ballHorizontalDistance = pitch.current[1] - newY;

            //If the ball is going down
            } else {
                newY = helpers.randomIntFromInterval(pitch.current[1], 6);
                ballHorizontalDistance = 6 - newY;
            }

            return ballHorizontalDistance;
        }

    };
})();