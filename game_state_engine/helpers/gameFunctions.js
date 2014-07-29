(function() {
    "use strict";

    var clockFunctions = require("./clock/clockFunctions.js"),
        playFunctions = require("./plays/playFunctions.js");

    module.exports = {
        "clock": clockFunctions,
        "plays": playFunctions
    };

}());