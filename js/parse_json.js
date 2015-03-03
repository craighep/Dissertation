/** 
 * Class responsible for collecting array of manoeuvre obejcts.
 * This class presents means to parse a JSON file containing manoeuvre break downs, and also to perform
 * and interative search through them using the user's inputs.
 * @name Parse_JSON
 * @class Parse_JSON
 * @constructor
 */
define(['jquery'], function($) {
    /** @global     */
    var manoeuvreArray = [{}];

    /**
     * Parses an external JSON file containing all the intstructions for each manoeuvre, and places this into
     * an array of object, with each object containing the OLAN pre and post-fix, the name and a list of
     * manoeuvrable instructions. Sets these objects to a global array.
     * @name Parse_JSON#parseManoeuvresFromJSON
     * @function
     *
     */
    function parseManoeuvresFromJSON(manoeuvreArray) {

        $.ajax({
            url: 'js/json/manoeuvres.json',
            dataType: 'json',
            async: false,
            success: function(json) {
                var catalogue = json["catalogue"];
                var manoeuvres = catalogue["manoeuvre"];
                var postfix = "";
                var x = 0;

                for (var a = 0; a < manoeuvres.length; a++) {
                    var manoeuvre = manoeuvres[a];
                    postfix = manoeuvre["_olan"];
                    var varients = manoeuvre["variant"];

                    for (var b = 0; b < varients.length; b++) {
                        var variant = varients[b];
                        manoeuvreArray[x] = {};
                        manoeuvreArray[x]["olan"] = variant["_olanPrefix"] + postfix;
                        manoeuvreArray[x]["components"] = variant["component"];
                        manoeuvreArray[x++]["name"] = variant["_name"];
                    }
                }
            }
        });
    }

    return {

        /**
         * Initial function called on startup of page, sets the manoeuvre list into a global variable accessible throughout
         * use of the site. This means instant access at any time, either using the {@link Parse_JSON#getManoeuvreArray} or 
         * {@link Parse_JSON#parseManoeuvreInput} methods.
         * @name Parse_JSON#init
         * @function
         *
         */
        init: function() {
            parseManoeuvresFromJSON(manoeuvreArray);
        },

        /**
         * A getter function for retreiving the entire list of manoeuvres.
         * @name Parse_JSON#getManoeuvreArray
         * @function
         * 
         * @returns {Array} manoeuvreArray  Array of manoeuvre objects
         */
        getManoeuvreArray: function() {
            return manoeuvreArray;
        },

        /**
         * When called, parses user input from OLAN box, and searches through array of manoeuvres for OLAN-matching
         * move. Repeats this for all the space seperated notations in the input. 
         * @name Parse_JSON#parseManoeuvreInput
         * @function
         *
         * @returns {Array} manoeuvreArray  Array of manoeuvre objects
         */
        parseManoeuvreInput: function() {
            var input = $('#input').val();

            var moves = input.split(" ");
            var returnMoves = [{}];
            var i = 0;
            for (move in moves) {
                for (var a = 0; a < manoeuvreArray.length; a++) {
                    if (manoeuvreArray[a]["olan"] === moves[move]) {
                        console.log(manoeuvreArray[a])
                        returnMoves[i] = manoeuvreArray[a];
                        i++;
                        break;
                    }
                }
            }
            if (Object.keys(returnMoves[0]).length === 0) {
                return [];
            }
            return returnMoves;
        }

    }
});
