/** 
 * Class responsible for adding and editing html related elements.
 * This class adds to and creates Html elements such as dropdown options for manoeuvres, the movie reel
 * for represnting a break down of moves, and the stats bar displayed on top of the canvas.
 * @name HtmlHandler
 * @class HtmlHandler
 * @constructor
 */
define(['jquery'], function($) {
    return {
        /**
         * Adds options to manoeuvre drop down list, each from the manoeuvre array gained from the JSON file.
         * Also appends the renderer element to the container div, which will contain the scene.
         * @name HtmlHandler#addContent
         * @function
         *
         * @param {Renderer} renderer  Renderer object where objects and effects will be added. Represents the
         * canvas on the HTML side
         */
        addContent: function(renderer, manoeuvres) {
            var dropdown = $('#dropdown');
            var m;

            for (m in manoeuvres) {
                var manoeuvre = manoeuvres[m];
                dropdown.append(
                    $('<option></option>').val(manoeuvre["olan"]).html(manoeuvre["name"])
                );
            }
            $('#container').append(renderer.domElement);
        },

        /**
         * Creates and edits the move reel display at bottom of canvas, depending on how many moves there are in
         * the OLAN input. Divides into 5, and any extra will be hidden as the play runs through the scenario.
         * Also compensates for the location of the footer by moving items up above the reel, to prevent blocks
         * from being covered by the copywrite or stats elements.
         * @name HtmlHandler#addMoveReel
         * @function
         *
         * @param {Array} moves  Array of moves each representing an OLAN string.
         */
        addMoveReel: function(moves) {
            var list = $('.moves');
            var movesHtml = "";
            var bottom = "0%";
            if (moves.length > 0)
                bottom = "15%";
            $('#footer').css({
                "bottom": bottom
            });
            bottom = "10px";
            if (moves.length > 4)
                bottom = "16%";
            $('#stats').css({
                "bottom": bottom
            });

            for (move in moves) {
                movesHtml += '<li class="move"></li>';
            }
            list.html(
                $(movesHtml)
            );
        },

        /**
         * Adds the statistics element based from the Stats.js script for showing FPS whilst running.
         * @name HtmlHandler#addStatsBar
         * @function
         *
         * @param {Stats} stats  Statistical appearence object of Frames per second using Stats,js library.
         */
        addStatsBar: function() {
            var stats = new Stats();
            $('#container').append(stats.domElement);
            return stats;
        },

        /**
         * Adds the list of manoeuvres from the JSON file to the help section, and adds each manoeuvre with 
         * its name and OLAN string to a list element. This means no need to write the html statically.
         * @name HtmlHandler#addHelpManoeuvreList
         * @function
         *
         * @param {Array} manoeuvres  Array of all the manoeuvres from the JSON file
         */
        addHelpManoeuvreList: function(manoeuvres) {
            var list = $('#manoeuvres');
            var manoeuvre;
            var listString = '';

            for (m in manoeuvres) {
                manoeuvre = manoeuvres[m];
                listString = "<b>" + manoeuvre["olan"] + "</b> - " + manoeuvre["name"];
                list.append(
                    $('<li></li>').html(listString)
                );
            }
        },

        /**
         * Enables and disables the input box in the header of the page to ensure user can only type when 
         * permitted. Useful for blocking input when models and other JSON is being loaded.
         * @name HtmlHandler#enableOLANInput
         * @function
         *
         * @param {Boolean} enable  Boolean flag for enabling/ disabling OLAN input field
         */
        enableOLANInput: function(enable) {
            $("input").prop('disabled', !enable);
        },

        /**
         * Enables and disables the input box in the header of the page to ensure user can only type when 
         * permitted. Useful for blocking input when models and other JSON is being loaded.
         * @name HtmlHandler#enableOLANInput
         * @function
         *
         * @param {Boolean} enable  Boolean flag for enabling/ disabling OLAN input field
         */
        setAutoLoadSwitch: function(autoSave) {    
            $('#autoSave').prop('checked', autoSave);
        },

        showImportSuccess: function(success) {
            if (success){
                $('#error').hide();
                $('#success').show();
            }
            else {
                $('#error').show();
                $('#success').hide();
            }
        }
    }
});
