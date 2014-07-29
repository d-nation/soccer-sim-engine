(function() {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore")._,
        clockFunctions = require("../helpers/clock/clockFunctions.js"),
        playFunctions = require("../helpers/plays/playFunctions.js");

    module.exports = Backbone.Model.extend({

        clock: {},

        plays: {},

        initialize: function() {
            var self = this;

            //bind all the clock functions
            _.each(clockFunctions, function(fn, key) {
                var nfn = _.bind(fn, self);
                self.clock[key] = nfn;
            });

            //bind all the play functions
            _.each(playFunctions, function(fn, key) {
                var nfn = _.bind(fn, self);
                self.plays[key] = nfn;
            });
        }


    });

}());
