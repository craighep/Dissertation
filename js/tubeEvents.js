define(['jquery'], function($) {
    return {
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
