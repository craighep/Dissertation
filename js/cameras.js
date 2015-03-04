/** 
 * Camera handler class fro creating and modifyng cameras in the scene. This includes the
 * aeroplane, which is created from a model and added to the environment. Contains all the
 * initialisers for each camera, edit methdods, and get methods.
 * @name Cameras
 * @class Cameras
 * @constructor 
 */
define(['jquery'], function($) {

    var standardCamera;
    var splineCamera;
    var cameraEye;
    var cameraHelper;
    var showCameraHelper = false;
    var onboard = false;

    /**
     * A toggle function for switching to the onboard camera on the aeroplane. Gets toggle view from
     * parameter and then sets the switch in the GUI to reflect this.
     * @name Main#setOnboardCamera
     * @function
     *
     * @param {Boolean} toggle  Used to set onboard camera on or off
     */
    function setOnboardCamera(toggle) {
        onboard = toggle;
        $('#onboardLabel').html('Camera onboard view: ' + (toggle ? 'ON' : 'OFF'));
    }

    /**
     * Camera Helper created, and sets the spline camera to stick to the edge of the manoeuvre line.
     * @name Main#setupCameraHelper
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
     * @name Main#setupCameraEye
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
     * @name Cameras#setupSplineCamera
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
     * @name Cameras#setupStandardCamera
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
         * @name Cameras#initCameras
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
         * @name Cameras#setupStandardCamera
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        getCameraEye: function() {
            return cameraEye;
        },

        /**
         * Returns the standard camera.
         * @name Cameras#getStandardCamera
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        getStandardCamera: function() {
            return standardCamera;
        },

        /**
         * Returns the camera to run along the spline.
         * @name Cameras#getSplineCamera
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        getSplineCamera: function() {
            return splineCamera;
        },

        /**
         * Returns guides to be shown along the camer path.
         * @name Cameras#getCameraHelper
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        getCameraHelper: function() {
            return cameraHelper;
        },

        /**
         * Returns the boolean saying if on board camera is enabled.
         * @name Cameras#getIsOnboard
         * @function
         *
         * @param {Parent} parent  Three.js 3D scene to have aeroplane added to.
         */
        getIsOnboard: function() {
            return onboard;
        },

        cameraReset: function() {
            cameraEye.position.set(0, 0, 0);
            cameraEye.rotation.x = 0;
            cameraEye.rotation.y = 0;
            cameraEye.rotation.z = 0;
        },

        /**
         * Toggles the visibilty of the camera (aeroplane) to true or false. Also gets the value of the
         * look-ahead checkbox to set this on update of the scene.
         * @name AnimationControls#showCamera
         * @function
         *
         * @param {Boolean} toggle  Turns camera view on or off
         */
        showCamera: function(toggle) {
            var lookAhead = $('#lookAhead').is(':checked');
            showCameraHelper = $('#cameraHelper').is(':checked');
            cameraHelper.visible = toggle;
            cameraEye.visible = toggle;
        },

        /**
         * A toggle function for switching to the onboard camera on the aeroplane. Gets toggle view from
         * parameter and then sets the switch in the GUI to reflect this.
         * @name Main#setOnboardCamera
         * @function
         *
         * @param {Boolean} toggle  Used to set onboard camera on or off
         */
        setOnboardCamera: function(toggle) {
            onboard = toggle;
            $('#onboard').prop('checked', onboard);
        },

        setRenderCamerasRotation: function() {
            splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
            cameraEye.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
             cameraEye.rotation.z += 90;
        },

        setSplineCameraLookAt: function(lookAt, normal) {
            splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        },

        setSplineCameraPosition: function(pos) {
            splineCamera.position.copy(pos);
        },

        setCameraEyePosition: function(pos) {
        	cameraEye.position.copy(pos);
        }
    }

});
