(function() {
    "use strict";

    var helpers = require("../../helpers/helperFunctions.js");

    module.exports = {
        determineSavedBallLocation: function(game){
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession"),
                newY = 3,
                newX = 8;

            //Shots from the bottom (default handles shots from top)
            if (pitch.current[1] >= 4){
                newY = 4;
            }

            //Shot on left goal (default handles shots on right goal)
            if ((possession === 1 && half === 1) || (possession === 2 && half === 2)){
                newX = 1;
            }

            return [newX, newY];
        },
        
        doesPlayerShoot: function(game){
            var pitch = game.get("pitch"),
                half = game.get("half"),
                possession = game.get("possession"),
                previousPlay = game.get("previousPlay"),
                random = 0,
                chance = false;
            
            //Shooting on left goal (default handles shots on right goal)
            if ((possession === 1 && half === 1) || (possession === 2 && half === 2)){
                               
                //Inside the penalty box (In play: 50% chance, Free Kick: 100%)
                random = helpers.randomIntFromInterval(0, 1);
                chance = (previousPlay !== 5 && !random) || previousPlay === 5;
                if (pitch.current[0] === 0 && pitch.current[1] > 1 && pitch.current[1] < 4 && chance){
                    return true;
                }
                
                //Right in front of the penalty box (In play: 33% chance, Free Kick: 66%)
                random = helpers.randomIntFromInterval(0, 2);
                chance = (previousPlay !== 5 && !random) || (previousPlay === 5 && random);
                if (pitch.current[0] === 1 && pitch.current[1] > 1 && pitch.current[1] < 4 && chance){
                    return true;
                }
                
                //Outside the corners of the penalty box (In play: 10% chance, Free Kick: 10%)
                random = helpers.randomIntFromInterval(0, 9);
                chance = !random;
                if (pitch.current[0] === 1 && (pitch.current[1] === 1 || pitch.current[1] === 4) && chance){
                    return true;
                }
            
            //Shooting on right goal (default handles shots on right goal)
            } else {
                
                //Inside the penalty box (In play: 50% chance, Free Kick: 100%)
                random = helpers.randomIntFromInterval(0, 1);
                chance = (previousPlay !== 5 && !random) || previousPlay === 5;
                if (pitch.current[0] === 8 && pitch.current[1] > 1 && pitch.current[1] < 4 && chance){
                    return true;
                }
                
                //Right in front of the penalty box (In play: 33% chance, Free Kick: 66%)
                random = helpers.randomIntFromInterval(0, 2);
                chance = (previousPlay !== 5 && !random) || (previousPlay === 5 && random);
                if (pitch.current[0] === 7 && pitch.current[1] > 1 && pitch.current[1] < 4 && chance){
                    return true;
                }
                
                //Outside the corners of the penalty box (In play: 10% chance, Free Kick: 10%)
                random = helpers.randomIntFromInterval(0, 9);
                chance = !random;
                if (pitch.current[0] === 7 && (pitch.current[1] === 1 || pitch.current[1] === 4) && chance){
                    return true;
                }
            }
            
            return false;
        },

        isShotOnTarget: function(game){
            var random = 0;

            //40% chance of being on goal
            random = helpers.randomIntFromInterval(0, 9);

            return random < 4;
        }
    };
})();