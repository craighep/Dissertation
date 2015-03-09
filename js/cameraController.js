/** 
 * Camera handler class fro creating and modifyng cameras in the scene. This includes the
 * aeroplane, which is created from a model and added to the environment. Contains all the
 * initialisers for each camera, edit methdods, and get methods.
 * @name CameraController
 * @class CameraController
 * @constructor 
 */
define(['jquery'], function($) {

    var standardCamera;
    var splineCamera;
    var cameraEye;
    var showCameraHelper = false;
    var onboard = false;
    var lookAhead = false;

    /**
     * Camera Helper created, and sets the spline camera to stick to the edge of the manoeuvre line.
     * @name CameraController#setupCameraHelper
     * @function
     *
     */
    function setupCameraHelper() {
        cameraHelper = new THREE.CameraHelper(splineCamera);
        cameraHelper.visible = showCameraHelper;
    }

    /**
     * Creates the areoplane model in the scene, by loading up an external JSON file containing a model.
     * Sets initial rotation and location values.
     * @name CameraController#setupCameraEye
     * @function
     *
     * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
     */
    function setupCameraEye(parent) {
        var loader = new THREE.ObjectLoader();
        loader.load("json/models/plane.json", function(obj) {
            cameraEye = obj;
            cameraEye.visible = true;
            cameraEye.rotation.x = 0;
            cameraEye.rotation.y = 0;
            cameraEye.rotation.z = 0;
            parent.add(cameraEye);
        });
    }

    /**
     * Creates the camera to look along the tube splines. Used to calculate where the plane should be in
     * relation to time. Adds to the parent.
     * @name CameraController#setupSplineCamera
     * @function
     *
     * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
     */
    function setupSplineCamera(parent) {
        splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 5000);
        parent.add(splineCamera);
    }

    /**
     * Creates the birds eye view camera, looking over the entire scene. Sets the initial camera location and 
     * how far it can see.
     * @name CameraController#setupStandardCamera
     * @function
     *
     */
    function setupStandardCamera() {
        standardCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
        standardCamera.position.set(0, 50, 500);
    }

    return {
        /**
         * Initiates the creation of all the different camera elements.
         * @name CameraController#initCameras
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        initCameras: function(parent) {
            setupSplineCamera(parent);
            setupStandardCamera();
            setupCameraEye(parent);
            setupCameraHelper();
        },

        /**
         * Returns the aeroplane.
         * @name CameraController#setupStandardCamera
         * @function
         *
         * @returns {Object} cameraEye  Aeroplane model for animating
         */
        getCameraEye: function() {
            return cameraEye;
        },

        /**
         * Returns the standard camera.
         * @name CameraController#getStandardCamera
         * @function
         *
         * @returns {PerspectiveCamera} standardCamera  Standard birds eye view camera
         */
        getStandardCamera: function() {
            return standardCamera;
        },

        /**
         * Returns the camera to run along the spline.
         * @name CameraController#getSplineCamera
         * @function
         *
         * @returns {PerspectiveCamera} splineCamera  Camera responsible for working out where to place aeroplane
         */
        getSplineCamera: function() {
            return splineCamera;
        },

        /**
         * Returns guides to be shown along the camer path.
         * @name CameraController#getCameraHelper
         * @function
         *
         * @returns {CameraHelper} cameraHelper  Draws lines and shows current tradgectory of spline camera
         */
        getCameraHelper: function() {
            return showCameraHelper;
        },

        /**
         * Returns the boolean saying if on board camera is enabled.
         * @name CameraController#getIsOnboard
         * @function
         *
         * @param {Boolean} onBoard  Onboard toggle
         */
        getIsOnboard: function() {
            return onboard;
        },

        /**
         * Resets the position of the aeroplane/camera eye. This is called when any changes to path is perfomred.
         * @name CameraController#cameraReset
         * @function
         *
         */
        cameraReset: function() {
            cameraEye.position.set(0, 0, 0);
            cameraEye.rotation.x = 0;
            cameraEye.rotation.y = 0;
            cameraEye.rotation.z = 0;
        },

        /**
         * Toggles the visibilty of the camera (aeroplane) to true or false. Also gets the value of the
         * look-ahead checkbox to set this on update of the scene.
         * @name CameraController#showCamera
         * @function
         *
         * @param {Boolean} toggle  Turns camera view on or off
         */
        showCamera: function(toggle) {
            lookAhead = $('#lookAhead').is(':checked');
            showCameraHelper = $('#cameraHelper').is(':checked');
            cameraHelper.visible = toggle;
            cameraEye.visible = toggle;
        },

        /**
         * A toggle function for switching to the onboard camera on the aeroplane. Gets toggle view from
         * parameter and then sets the switch in the GUI to reflect this.
         * @name CameraController#setOnboardCamera
         * @function
         *
         * @param {Boolean} toggle  Used to set onboard camera on or off
         */
        setOnboardCamera: function(toggle) {
            onboard = toggle;
            $('#onboard').prop('checked', onboard);
        },

        /**
         * Sets the rotation of the spline camera whilst animating along a manoeuvre.
         * Also rotates the aeroplane accordingly.
         * @name CameraController#setRenderCamerasRotation
         * @function
         *
         */
        setRenderCamerasRotation: function() {
            splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
            cameraEye.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
            cameraEye.rotation.z += 90;
        },

        /**
         * Ensures the aeroplane looks in the correct directoion when naviagting a manoeuvre.
         * @name CameraController#setSplineCameraLookAt
         * @function
         *
         * @param {Vector} lookAt  A vector ahead of the current position for the camera to be looking towards.
         * @param {Vector} normal  
         */
        setSplineCameraLookAt: function(lookAt, normal) {
            splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        },

        /**
         * Sets the location of the spline camera based on the current manoeuvre in relation to time.
         * @name CameraController#setSplineCameraPosition
         * @function
         *
         * @param {Vector} pos  Vector position
         */
        setSplineCameraPosition: function(pos) {
            splineCamera.position.copy(pos);
        },

        /**
         * Sets the location of the aeroplane passed from the spline camera's location.
         * @name CameraController#setCameraEyePosition
         * @function
         *
         * @param {Vector} pos  Vector position
         */
        setCameraEyePosition: function(pos) {
        	cameraEye.position.copy(pos);
        }
    }

});
