/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name AnimationControls
 * @class AnimationControls
 * @constructor
 */
define(['jquery', 'parseJson', 'manoeuvreController', 'html'], function($, ParseJson, ManoeuvreController, Html) {
    var cameras;
    var renderer;
    var paused = true;
    var scale = 4;
    var speed = 20;
    var parent;

	/**
     * Resets the aeroplane loaction and rotation, the movie reel, manoeuvres shown and camera each time
     * it is triggered by either a change in the OLAN entered, or an appearence change. Means that problems
     * caused by changing any effects while animating is ongoing are avoided.
     * @name AnimationControls#refreshScene
     * @function
     *
     */
    function refreshScene() {
        var manoeuvres = [];
        manoeuvres = ParseJson.parseManoeuvreInput();
        pause(true);
        cameras.cameraReset();
        if (manoeuvres.length < 1) {
            cameras.showCamera(true);
            parent.remove(ManoeuvreController.getTubeMesh());
        } else {
            cameras.showCamera(true);

            for (m in manoeuvres) {
                ManoeuvreController.addTube(manoeuvres[m], parent);
            }
        }
        Html.addMoveReel(manoeuvres);
        cameras.setOnboardCamera(false);
    }

    /**
     * Sets the scale of the manoeuvre based on the input in the GUI controls. Can be from 1 to 8 multiplied.
     *
     * @name AnimationControls#setScale
     * @function
     */
    function setScale() {
        scale = parseInt($('#scale').val());
    }

    /**
     * Sets the speed of the animation of the flight based on number of seconds. Range is from 40 to 1.
     * @name AnimationControls#setSpeed
     * @function
     *
     */
    function setSpeed() {
        speed = 41 - $('#speed').val(); // opposite becasue bigger means slower in terms of time
    }

    /**
     * Pauses the animation for the plane. Movement is still animated though.
     * Also changes the html button src on a toggle basis.
     * @name AnimationControls#pause
     * @function
     *
     * @param {Boolean} p - pause toggle
     */
    function pause(p) {
        paused = p;
        var imgUrl = "img/"
        $('#pause').css({
            "background-image": "url(" + imgUrl + (paused ? "play" : "pause") + ".png)"
        });
    }

    return {

        /**
         * Sets up listeners for GUI controls. Each listener links to its own event, onclick, on change and
         * on key events where the user types into the OLAN box.
         * @name AnimationControls#initContolEvents
         * @function
         *
         */
        initContolEvents: function(rend, cams, p) {
            // set variables first
            cameras = cams;
            renderer = rend;
            parent = p;

            // setup event listeners for range of controls
            $('#rdropdown').change(function() {
                addTube(this.value);
            });
            $('#radiusSegments').change(refreshScene);
            $('#closed').change(refreshScene);
            $('#segments').change(refreshScene);
            $('#scale').change(setScale);
            $('#lookAhead').change(function() {
                cameras.showCamera();
            });
            $('#cameraHelper').change(function() {
                cameras.showCamera();
            });
            $('#onboard').change(function() {
                var onboard = cameras.getIsOnboard();
                cameras.setOnboardCamera(!onboard);
            });
            $('#pause').click(function() {
                pause(!paused); // Reverse current setting(pause / un-pause)
            });
            $('#about').click(function() {
                pause(true);
            });
            $('#help').click(function() {
                pause(true);
            });
            $("#input").keyup(refreshScene);
            $("#speed").change(setSpeed);
        },

        getIsPaused: function() {
            return paused;
        },

        getAnimationSpeed: function() {
            return speed;
        },

        getScale: function() {
            return scale;
        },

        getTube: function() {
            return ManoeuvreController.getTube();
        }
    }
});
