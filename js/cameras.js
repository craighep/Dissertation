/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name AnimateEvents
 * @class AnimateEvents
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

    function setupSplineCamera(parent) {
        splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 5000);
        parent.add(splineCamera);
    }

    function setupStandardCamera() {
        standardCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
        standardCamera.position.set(0, 50, 500);
    }

    return {

        initCameras: function(parent) {
            setupSplineCamera(parent);
            setupStandardCamera();
            setupCameraEye(parent);
            setupCameraHelper();
        },

        getCameraEye: function() {
            return cameraEye;
        },

        getStandardCamera: function() {
            return standardCamera;
        },

        getSplineCamera: function() {
            return splineCamera;
        },

        getCameraHelper: function() {
            return cameraHelper;
        },

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
