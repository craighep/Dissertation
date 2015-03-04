/** 
 * Temporary class for returning curves in relaton to OLAN notation entry.
 * @name TubeEvents
 * @class TubeEvents
 * @constructor
 */
define(['jquery'], function($) {
    return {
        /**
         * A getter function for taking in the move string, and outputing a curve string.
         * @name TubeEvents#getTubes
         * @function
         * 
         * @params {String} move  OLAN Manoeuvre string
         * @returns {String} move Curve string
         */
        getTubes: function(move) {
            var returnMove = "";
            switch (move.toLowerCase()) {
                case "a":
                    returnMove = "VivianiCurve";
                    break;
                case "b":
                    returnMove = "HeartCurve"
                    break;
                case "c":
                    returnMove = "GrannyKnot";
                    break;
                case "d":
                    returnMove = "HelixCurve"
                    break;
                case "e":
                    returnMove = "FigureEightPolynomialKnot";
                    break;
                case "f":
                    returnMove = "TorusKnot"
                    break;
                case "o":
                    returnMove = "Circle"
                    break;
            }
            return returnMove;
        }
    }
});
