/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name AnimationController
 * @class AnimationController
 * @constructor
 */
define(['jquery', 'parseJson', 'manoeuvreController', 'htmlHandler'], function($, ParseJson, ManoeuvreController, HtmlHandler) {
    
    var cameraController;
    var renderer;
    var paused = true;
    var scale = 4;
    var speed = 20;
    var parent;

	/**
     * Resets the aeroplane loaction and rotation, the movie reel, manoeuvres shown and camera each time
     * it is triggered by either a change in the OLAN entered, or an appearence change. Means that problems
     * caused by changing any effects while animating is ongoing are avoided.
     * @name AnimationController#refreshScene
     * @function
     *
     */
    function refreshScene() {
        var manoeuvres = [];
        manoeuvres = ParseJson.parseManoeuvreInput();
        pause(true);
        cameraController.cameraReset();
        if (manoeuvres.length < 1) {
            cameraController.showCamera(true);
            parent.remove(ManoeuvreController.getTubeMesh());
        } else {
            cameraController.showCamera(true);

            for (m in manoeuvres) {
                ManoeuvreController.addTube(manoeuvres[m], parent);
            }
        }
        HtmlHandler.addMoveReel(manoeuvres);
        cameraController.setOnboardCamera(false);
    }

    /**
     * Sets the scale of the manoeuvre based on the input in the GUI controls. Can be from 1 to 8 multiplied.
     *
     * @name AnimationController#setScale
     * @function
     */
    function setScale() {
        scale = parseInt($('#scale').val());
    }

    /**
     * Sets the speed of the animation of the flight based on number of seconds. Range is from 40 to 1.
     * @name AnimationController#setSpeed
     * @function
     *
     */
    function setSpeed() {
        speed = 41 - $('#speed').val(); // opposite becasue bigger means slower in terms of time
    }

    /**
     * Pauses the animation for the plane. Movement is still animated though.
     * Also changes the html button src on a toggle basis.
     * @name AnimationController#pause
     * @function
     *
     * @param {Boolean} p  Pause toggle
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
         * @name AnimationController#initContolEvents
         * @function
         *
         * @param {Renderer} rend  Renderer to be added to
         * @param {Cameras} cams  Cameras object to be affected when triggured by change of input
         * @param {Parent} p  Parent to be added to by tube
         */
        initContolEvents: function(rend, cams, p) {
            // set variables first
            cameraController = cams;
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
                cameraController.showCamera();
            });
            $('#cameraHelper').change(function() {
                cameraController.showCamera();
            });
            $('#onboard').change(function() {
                var onboard = cameraController.getIsOnboard();
                cameraController.setOnboardCamera(!onboard);
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

        /**
         * Returns the state of the animation if it is playing or paused.
         * @name AnimationController#getIsPaused
         * @function
         *
         * @returns {Boolean} paused  Toggle for play/pause
         */
        getIsPaused: function() {
            return paused;
        },

        /**
         * Returns the speed of the whole animation in seconds.
         * @name AnimationController#getAnimationSpeed
         * @function
         *
         * @returns {Integer} speed  Speed in seconds of animation
         */
        getAnimationSpeed: function() {
            return speed;
        },

        /**
         * Returns the scale of the manoeuvres on the scene. Default is 4.
         * @name AnimationController#getScale
         * @function
         *
         * @returns {Integer} scale  Value to scale the aerolane and manoeuvers
         */
        getScale: function() {
            return scale;
        },

        /**
         * Acsesses the {@link ManoeuvreController#getTube} method to compile the OLAN strings and
         * create a tube represnting the entire sequence.
         * @name AnimationController#getTube
         * @function
         *
         * @returns {Tube} tube  Manoeuvre set compiled into a single tube
         */
        getTube: function() {
            return ManoeuvreController.getTube();
        }
    }
});
