/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name AnimationController
 * @class AnimationController
 * @constructor
 */
define(['jquery', 'parseJson', 'manoeuvreController', 'htmlHandler', 'exportImportProjects'],
    function($, ParseJson, ManoeuvreController, HtmlHandler, ExportImportProjects) {

        var cameraController;
        var renderer;
        var paused = true;
        var scale = 4;
        var speed = 0.005;
        var parent;
        var time = 0;

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
            time = 0;
            cameraController.cameraReset();
            if (manoeuvres.length < 1) {
                pause(true);
                cameraController.showCamera(true);
                ManoeuvreController.removeTube(parent);
            } else {
                cameraController.showCamera(true);
                ManoeuvreController.addTube(manoeuvres, parent, false);
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
            speed = parseFloat($('#speed').val()); // opposite becasue bigger means slower in terms of time
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

        /**
         * Triggers the local storage to be loaded 
         * @name AnimationController#initialiseLocalStorage
         * @function
         *
         */
        function initialiseLocalStorage() {
            var autoSave = ExportImportProjects.getAutoLoadLocal(); // sets the switch in the GUI to last session
            HtmlHandler.setAutoLoadSwitch(autoSave);
            if (!autoSave)
                return;
            var previousOLANString = ExportImportProjects.importFromLocalStorage();
            $('#input').val(previousOLANString);
            refreshScene();
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
                $('#addOLAN').click(function() {
                    var newVal = $('#dropdown').val();
                    var oldVal = $('#input').val();
                    if (oldVal.length > 0)
                        newVal = " " + newVal;
                    $('#input').val(oldVal + newVal);
                    refreshScene();
                });
                $('#radiusSegments').change(refreshScene);
                $('#closed').change(refreshScene);
                $('#segments').change(refreshScene);
                $('#scale').change(setScale);
                $('#lookAhead').change(function() {
                    cameraController.showCamera();
                });
                $('#cameraHelper').change(function() {
                    cameraController.showCameraHelper();
                });
                $('#onboard').change(function() {
                    var onboard = cameraController.getIsOnboard();
                    cameraController.setOnboardCamera(!onboard);
                });
                $('#pause').click(function() {
                    manoeuvres = ParseJson.parseManoeuvreInput();
                    if (manoeuvres.length > 0)
                        pause(!paused); // Reverse current setting(pause / un-pause)
                });
                $('#about').click(function() {
                    pause(true);
                });
                $('#help').click(function() {
                    pause(true);
                });
                $("#input").keyup(function(event) {
                    var keycode = event.keyCode.toString();
                    if (keycode == '13') {
                        pause(!paused);
                    } else {
                        refreshScene();
                    }
                    event.stopPropagation();
                });
                $("#speed").change(setSpeed);
                $("#hideShow").click(function() {
                    HtmlHandler.hideShowReel();
                });
                // -------------------------------------
                // SAVE/ LOAD EVENTS
                //--------------------------------------
                initialiseLocalStorage();
                $('#autoSave').change(function() {
                    var autoSave = $('#autoSave').is(':checked');
                    ExportImportProjects.setAutoLoadLocal(autoSave);
                });
                $('#export').click(function() {
                    ExportImportProjects.exportToJSON($('#input').val(), this);
                });
                $('input[name=file]').change(function() {
                    ExportImportProjects.importFromJSON(this);
                    var ready = false;
                    var wait;
                    var counter = 0;
                    var check = function() {
                        wait = setTimeout(check, 500);
                        counter += 500;
                        if (counter > 5000) {
                            clearTimeout(wait);
                            HtmlHandler.showImportSuccess(false);
                        }
                        var manoeuvreString = ExportImportProjects.getJSONImport();
                        if (manoeuvreString != null) {
                                                            console.log(manoeuvreString);

                            if (manoeuvreString == "invalid format")
                            {
                                clearTimeout(wait);
                                HtmlHandler.showImportSuccess(false);
                            }
                            else if (manoeuvreString != "") {
                                clearTimeout(wait);
                                $('#input').val(manoeuvreString);
                                refreshScene();
                                HtmlHandler.showImportSuccess(true);
                            }
                        }
                    }
                    check();
                });
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
            },

            getAnimateTime: function() {
                var moves = ParseJson.parseManoeuvreInput().length;
                time += speed;
                if(moves < time){
                    time = 0;
                    pause(true);
                    HtmlHandler.resetReel(moves);
                }
                return time;
            }
        }
    });
