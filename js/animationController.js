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
            refreshCameras();
            refreshManoeuvres(manoeuvres);
        }

        /**
         * Resets the cameras back to default positons, and turns off the on-board camera.
         * @name AnimationController#refreshCameras
         * @function
         *
         */
        function refreshCameras() {
            if(typeof cameraController == 'undefined')
                return;
            cameraController.cameraReset(parent);
            cameraController.setOnboardCamera(false);
            cameraController.showCamera(true);
        }

        /**
         * Updates the scene with the newly entered maneouvres.
         * @name AnimationController#refreshManoeuvres
         * @function
         *
         * @param {Array[Manoeuvres]} manoeuvres  Array holding the manoeuvres entered from OLAN
         */
        function refreshManoeuvres(manoeuvres) {
            if (manoeuvres.length < 1) {
                pause(true);
                ManoeuvreController.removeTube(parent);
                HtmlHandler.warnManoeuvres(false);
            } else {
                ManoeuvreController.addTube(manoeuvres, parent, false);
            }
            HtmlHandler.addMoveReel(manoeuvres);
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
            HtmlHandler.disableReelNavigation(paused);
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

        /**
         * Turns off or on the auto-repeat trait of animating the flight paths.
         * @name AnimationController#getAutoRepeat
         * @function
         *
         * @returns {Boolean} flag  Value of check box for setting aut-repeat on.
         **/
        function getAutoRepeat() {
            var flag = $('#repeat').is(':checked');
            return flag;
        }

        /**
         * Adds listeners for the OLAN dropdown, input box and play/ pause button.
         * @name AnimationController#setUpInputListeners
         * @function
         *
         **/
        function setUpInputListeners() {
            $('#addOLAN').click(function() {
                    var newVal = $('#dropdown').val();
                    var oldVal = $('#input').val();
                    if (oldVal.length > 0)
                        newVal = " " + newVal;
                    $('#input').val(oldVal + newVal);
                    refreshScene();
            });
            $('#pause').click(function() {
                    manoeuvres = ParseJson.parseManoeuvreInput();
                    if (manoeuvres.length > 0)
                        pause(!paused); // Reverse current setting(pause / un-pause)
            });
            $("#input").keyup(function(event) {
                    $('#input').val($('#input').val().toLowerCase());
                    var keycode = event.keyCode;
                    if (keycode == '13') {
                        pause(!paused);
                    } else {
                        refreshScene();
                    }
                    event.stopPropagation();
            });
        }

        /**
         * Sets up listeners for actions with the animation options. For example, on chnage of options
         * concerning the constrcution of flights causes the scene to be refreshed.
         * @name AnimationController#setUpAnimationListeners
         * @function
         *
         **/
        function setUpAnimationListeners() {
            var refreshEvents = ['#radiusSegments', '#closed', '#segments'];
            for(var rf in refreshEvents){
                $(refreshEvents[rf]).change(refreshScene);
            }
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
            $("#speed").change(setSpeed);
        }

        /**
         * Creates GUI listeners for page elements such as help and about sections. 
         * Listener also for hiding or showing the move reel.
         * @name AnimationController#setUpPageListeners
         * @function
         *
         **/
        function setUpPageListeners() {
            $('#about').click(function() {
                pause(true);
            });
            $('#help').click(function() {
                pause(true);
            });           
            $("#hideShow").click(function() {
                HtmlHandler.hideShowReel();
            });
        }

        /**
         * Creates GUI listeners for the movie reel for moving left and right along manoeuvres.
         * @name AnimationController#setUpPageLsetUpReelListenersisteners
         * @function
         *
         **/
        function setUpReelListeners() {
            $('#moveReelRight').click(function() {
                HtmlHandler.moveReelRight();
            });
            $('#moveReelLeft').click(function() {
                HtmlHandler.moveReelLeft();
            });    
        }

        /**
         * Sets up listeners for importing and exporting OLAN entered by the user. 
         * Performs a call to initialise local storage, so previous entry from the user is 
         * automatically added to the scene. 
         * @name AnimationController#setUpSaveLoadListeners
         * @function
         *
         **/
        function setUpSaveLoadListeners() {

            initialiseLocalStorage();

            $('#autoSave').change(function() {
                var autoSave = $('#autoSave').is(':checked');
                ExportImportProjects.setAutoLoadLocal(autoSave);
            });
            $('#export').click(function() {
                ExportImportProjects.exportToJSON($('#input').val(), this);
            });
            $('input[name=file]').change(function() {
                var file = this.files[0];
                ExportImportProjects.importFromJSON(file);
                HtmlHandler.showLoadingImport(true);
                var ready = false;
                var wait;
                var counter = 0;
                var check = function() {
                    wait = setTimeout(check, 500);
                    counter += 500;
                    if (counter > 5000) {
                        clearTimeout(wait);
                        HtmlHandler.showImportSuccess(false);
                        HtmlHandler.showLoadingImport(false);
                    }
                    var manoeuvreString = ExportImportProjects.getJSONImport();
                    if (manoeuvreString != null) {

                        if (manoeuvreString == "invalid format")
                        {
                            clearTimeout(wait);
                            HtmlHandler.showLoadingImport(false);
                            HtmlHandler.showImportSuccess(false);
                        }
                        else if (manoeuvreString != "") {
                            clearTimeout(wait);
                            $('#input').val(manoeuvreString);
                            refreshScene();
                            HtmlHandler.showLoadingImport(false);
                            HtmlHandler.showImportSuccess(true);
                        }
                    }
                }
                check();
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
            initControlEvents: function(rend, cams, p) {
                // set variables first
                cameraController = cams;
                renderer = rend;
                parent = p;
                // setup event listeners for range of controls
                setUpInputListeners();
                setUpAnimationListeners();
                setUpPageListeners();
                setUpSaveLoadListeners();
                setUpReelListeners();
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

            /**
             * The getter method for the time field which keeps track of where the animation has
             * got to in terms of an overall percentage of the routine. Also checks when the 
             * time field has reached the end of its animation path, and resets back to the start,
             * alongside calling the reset of the move reel.
             * @name HtmlHandler#getAnimateTime
             * @function
             *
             * @returns {Long} time  Current animate time.
             */
            getAnimateTime: function() {
                var moves = ParseJson.parseManoeuvreInput().length;
                time += speed;
                if(moves < time){
                    time = 0;
                    if(!getAutoRepeat()){
                        pause(true);
                    }
                    HtmlHandler.resetReel(moves);
                } 
                return time;
            }
        }
    });
