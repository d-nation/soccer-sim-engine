(function() {
    "use strict";

    module.exports = {
        randomIntFromInterval: function(min, max){
            return Math.floor(Math.random()*(max-min+1)+min);
        },

        "formatTime": function(minute, second){
            var twoDigitMinute = (minute < 10) ? "0" + minute : minute,
                twoDigitSecond = (second < 10) ? "0" + second : second;

            return twoDigitMinute + ":" + twoDigitSecond;
        }
    };

}());