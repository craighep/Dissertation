/** 
 * Class responsible for collecting array of manoeuvre obejcts.
 * This class presents means to parse a JSON file containing manoeuvre break downs, and also to perform
 * and interative search through them using the user's inputs.
 * @name ParseJson
 * @class ParseJson
 * @constructor
 */
define(['jquery', 'component', 'exportImportProjects'], function($, Component, ExportImportProjects) {

    var manoeuvreArray = [{}];

    /**
     * Parses an external JSON file containing all the intstructions for each manoeuvre, and places this into
     * an array of object, with each object containing the OLAN pre and post-fix, the name and a list of
     * manoeuvrable instructions. Sets these objects to a global array.
     * @name ParseJson#parseManoeuvresFromJSON
     * @function
     *
     */
    function parseManoeuvresFromJSON() {

        $.ajax({
            url: 'json/manoeuvres.json',
            dataType: 'json',
            async: false,
            success: function(json) {
                var catalogue = json["catalogue"];
                var manoeuvres = catalogue["manoeuvre"];
                var postfix = "";
                var x = 0;

                for (var a = 0; a < manoeuvres.length; a++) { // loop through manoeuvre array and get name
                    var manoeuvre = manoeuvres[a];
                    postfix = manoeuvre["_olan"];
                    var varients = manoeuvre["variant"];

                    for (var b = 0; b < varients.length; b++) { // for each varient add this before the name
                        var variant = varients[b];
                        manoeuvreArray[x] = {};
                        manoeuvreArray[x]["olan"] = variant["_olanPrefix"] + postfix;
                        var components = [];

                        for (var c = 0; c < variant["component"].length; c++) { // then go through each component of varient
                            var comp = variant["component"][c];
                            var pitch = comp["_pitch"];
                            var yaw = comp["_yaw"];
                            var roll = comp["_roll"];
                            var length = parseFloat(comp["_length"]);
                            var component = new Component(yaw, pitch, roll, length);
                            components[c] = component;
                        }
                        manoeuvreArray[x]["components"] = components;
                        manoeuvreArray[x++]["name"] = variant["_name"];

                    }
                }
            }
        });
    }

    /**
     * Performs regex on the input of the user's input and looks for parameters to
     * indicates the starting place of the next manoeuvre in the array.
     * @name ParseJson#parseSpacer
     * @function
     *
     * @param {String} spacerInput  Entry data from the OLAN box.
     */
    function parseSpacer(spacerInput){
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(spacerInput);
            var spaceParams = [];

            if(matches == null || matches.length != 2)
                return;
            //----------------------------------------
            if(matches[1].indexOf(',') === -1){
                spaceParams[0] = matches[1];
            }
            else {
                spaceParams = matches[1].split(",");
            }
            if(spaceParams.length === 0)
                return;
            //----------------------------------------
            for(p in spaceParams){
                if(isNaN(spaceParams[p]))
                    return;
            }
            //----------------------------------------
            // TODO
    }
    return {

        /**
         * Initial function called on startup of page, sets the manoeuvre list into a global variable accessible throughout
         * use of the site. This means instant access at any time, either using the {@link ParseJson#getManoeuvreArray} or 
         * {@link ParseJson#parseManoeuvreInput} methods.
         * @name ParseJson#init
         * @function
         *
         */
        init: function() {
            parseManoeuvresFromJSON();
        },

        /**
         * A getter function for retreiving the entire list of manoeuvres.
         * @name ParseJson#getManoeuvreArray
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
         * @name ParseJson#parseManoeuvreInput
         * @function
         *
         * @returns {Array} manoeuvreArray  Array of manoeuvre objects
         */
        parseManoeuvreInput: function() {
            var input = $('#input').val();
            ExportImportProjects.exportToLocalStorage(input);
            var moves = input.split(" ");
            var returnMoves = [{}];
            var i = 0;

            for (m in moves) {
                var move = moves[m];
                if (move.indexOf("(") > -1) {
                    var spacer = parseSpacer(move);
                    if(spacer != null) {
                        //TODO
                    }
                }
                for (var a = 0; a < manoeuvreArray.length; a++) {
                    if (manoeuvreArray[a]["olan"] === move) {
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
