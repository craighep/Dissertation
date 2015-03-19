/** 
 * Class responsible for adding and editing html related elements.
 * This class adds to and creates Html elements such as dropdown options for manoeuvres, the movie reel
 * for represnting a break down of moves, and the stats bar displayed on top of the canvas.
 * @name HtmlHandler
 * @class HtmlHandler
 * @constructor
 */
define(['jquery'], function($) {

        /**
         * Moves the reel along by 4 places each time the animation completes 5 manoeuvres.
         * Does this by hiding the four or more previus elements with the 'hidden' class.
         * @name HtmlHandler#scrollReel
         * @function
         *
         * @param {Float} time  The current amount of distance travelled in realtion to the 
         * amount of manoeuvres
         */
        function scrollReel(time){
            var hide = time - 5;
            var count = 0;
            var track = 4;
            while (hide >= 0){
                hide -= 5;
                while(count < track){
                    $( "#move_"+count ).addClass( "hidden" );
                    count++;
                }
                track += 5;
            }
        }

        /**
         * Checls the amount of manoeuvres displayed in the reel, if there are none, then do not
         * show the toggle button, otherwise show it.
         * @name HtmlHandler#showReelToggle
         * @function
         *
         * @param {Integer} reelLength  The amount manoeuvres displayed in the reel
         */
        function showReelToggle(reelLength){
            if (reelLength > 0)
                $("#hideShow").show();
            else
                $("#hideShow").hide();
        }
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
            var bottom = "10px";
            if (moves.length > 4)
                bottom = "16%";

            $('#stats').css({
                "bottom": bottom
            });

            for (m in moves) {
                manouvreImg = "".concat(moves[m]["olan"],".png");
                movesHtml += '<li class="move" id="move_'+m+'">' +
                                '<img src="img/manoeuvres/'+manouvreImg+'" align="middle">' +
                                '<div class="progressbar">'+
                                    '<div id="progressbar_'+m+'"></div>'+
                                '</div>' +
                                '<div id="progressback_'+m+'" class="progressback"></div>'+
                              '</li>';
            }
            list.html(
                $(movesHtml)
            );
            showReelToggle(moves.length);
            $( ".progressbar > div" ).css( "width", "0%" );
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

        /**
         * Function for displaying the message provided back after attempting to upload and import a 
         * manoeuvre set json file. Can either be a success or an error. 
         * @name HtmlHandler#showImportSuccess
         * @function
         *
         * @param {Boolean} success  Flag for error or success
         */
        showImportSuccess: function(success) {
            if (success){
                $('#error').hide();
                $('#success').show();
            }
            else {
                $('#error').show();
                $('#success').hide();
            }
        },

        /**
         * Updates the move reel progress bars. Gets the current percentage of each move in relation to 
         * the overall time complete. Fills the bars already in the html with the width of each
         * individual percentage.
         * @name HtmlHandler#updateMoveReel
         * @function
         *
         * @param {Float} time  The current amount of distance travelled in realtion to the 
         * amount of manoeuvres
         * @param {Integer} moves  The number of manoeuvres in the scenario
         */
        updateMoveReel: function(time, moves) {
            var movePerc = 1 / moves;
            var t = 0;
            for(var i = 0; i <= moves; i++){
                if ( time < i)
                    t =0;
                else{
                    t = (time - i) * 100;
                    if (t > 100)
                        t = 100;
                }
                $( "#progressbar_"+(i) ).css( "width", t+"%" );
                $( "#progressback_"+(i) ).css( "width", t+"%" );
            }
        scrollReel(time);
        },

        /**
         * Resets the move reel, by removing the hidden attributes from all the manoeuvres.
         * @name HtmlHandler#resetReel
         * @function
         *
         * @param {Integer} moves  The amount of manoeuvres to reset the hidden attribute.
         */
        resetReel: function(moves){
            var i = 0;
            while(i < moves){
                $( "#move_"+i ).removeClass( "hidden" );
                i++;
            }
        },

        /**
         * Toggles the visibility of the move reel, which is called when the user presses the
         * toggle button.
         * @name HtmlHandler#hideShowReel
         * @function
         *
         */
        hideShowReel: function() {
            var moveReelElement = $(".moveStrip");
            var hideShowButtonElement = $("#hideShow");
            moveReelElement.toggle();
            var bottom = 0;
            var html = "+";
            if (moveReelElement.is(":visible") ){
                bottom = 15;
                html = "-";
            }
            hideShowButtonElement.css("bottom",bottom+"%");
            hideShowButtonElement.html(html);
        }
    }
});
