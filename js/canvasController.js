/** 
 * Class creates listeners for a range of user events on the canvas.
 * This class is responsible for setting up and implimenting listeners for different sets of actions performed
 * on the canvas area. Including zooming, rotating and moving around the scene.
 * @name CanvasController
 * @class CanvasController
 * @constructor
 */
define(function() {

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var renderer;
    var camera;
    var targetRotationY = 0;
    var targetRotationOnMouseDownY = 0;
    var targetRotationX = 0;
    var targetRotationOnMouseDownX = 0;
    var mouseX = 0;
    var mouseXOnMouseDown = 0;
    var mouseY = 0;
    var mouseYOnMouseDown = 0;
    var scale = 1;
    var getLatestMoveX = 0;
    var getLatestMoveZ = 0;

    /**
     * Event that calculates the rotation and movement performed by the user starting from the mouse down to 
     * mouse up events. Sets global variables holding these values for use in the get methods used by the 
     * {@link Main} class.
     * @name CanvasController#onDocumentMouseDown
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentMouseDown(event) {
        event.preventDefault();
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownX = targetRotationX;
        targetRotationOnMouseDownY = targetRotationY;
    }

    /**
     * Multiplies the rotating by 0.02 each time the mouse is moved whilst held down on the canvas.
     * @name CanvasController#onDocumentMouseMove
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
    }

    /**
     * Removes the listeners for mouse events once a user releases the mouse click button on the canvas.
     * @name CanvasController#onDocumentMouseUp
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentMouseUp(event) {
        renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);
    }

    /**
     * Removes the listeners for mouse events once a user moves the mouse out of the canvas.
     * @name CanvasController#onDocumentMouseOut
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentMouseOut(event) {
        renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);
    }

    /**
     * Adds the listener for different mouse actions once a user clicks onto the canvas, holding the mouse down/
     * @name CanvasController#onDocumentTouchStart
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentTouchStart(event) {

        if (event.touches.length == 1) {
            event.preventDefault();
            mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
            targetRotationOnMouseDownX = targetRotationX;
            mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;
        }
    }

    /**
     * Alternative event for calculating rotation, for touch devices. Will work on phones and rotate scene 
     * when user drags across the screen.
     * @name CanvasController#onDocumentTouchMove
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onDocumentTouchMove(event) {

        if (event.touches.length == 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;
            mouseY = event.touches[0].pageX - windowHalfX;
            targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
        }
    }

    /**
     * Resizes the canvas in relation to the window size. Resizes all the objects too, and changes the 
     * camera perspective to view from the correct range.
     * @name CanvasController#onWindowResize
     * @function
     *
     */
    function onWindowResize() {
        windowHalfX = window.innerWidth;
        windowHalfY = window.innerHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Updates the camera zoom parameter based on the amount scrolled. Has a maximum and minimum value of scroll.
     * @name CanvasController#onMouseScroll
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onMouseScroll(event) {
        var event = window.event || e; // old IE support
        var d = ((typeof event.wheelDelta != "undefined") ? (-event.wheelDelta) : event.detail);
        d = 100 * ((d > 0) ? 1 : -1);
        var cPos = camera.position;
        if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y)) 
            return;
        if (cPos.x > 1 || cPos.x < 0) {
            return;
        }
        mb = d > 0 ? 1.1 : 0.9;
        cPos.x = cPos.x * mb;
        cPos.y = cPos.y * mb;
        cPos.z = cPos.z * mb;
        camera.updateProjectionMatrix();
    }

    /**
     * A listener to run each time the up, down, left and right arrows are pressed. Sets the global variables
     * which are acesses in get methods to navigate the camera about the canvas.
     * @name CanvasController#onKeyDown
     * @function
     *
     * @param {Event} event  Event triggured
     */
    function onKeyDown(event) {
        var step = 5;
        switch (event.keyCode.toString()) {
            case "38":
                // up
                getLatestMoveZ += step;
                break;
            case "40":
                // down
                getLatestMoveZ -= step;
                break;
            case "37":
                // left
                getLatestMoveX += step;
                break;
            case "39":
                // right
                getLatestMoveX -= step;
                break;
        }
    }

    return {

        /**
         * Initial function which is called on startup for creating event listeners in the canvas area. 
         * Including scroll, mouse drag, touch drag and keyboard events. 
         * @name CanvasController#init
         * @function
         *
         * @param {Renderer} r  Renderer object to have listeners added to
         * @param {Camera} c  Camera object to have zoom and aspect ratio modified by events
         */
        init: function(r, c) {
            renderer = r;
            camera = c;
            renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
            renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
            renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
            window.addEventListener('resize', onWindowResize, false);
            renderer.domElement.addEventListener("mousewheel", onMouseScroll, false);
            renderer.domElement.addEventListener("DOMMouseScroll", onMouseScroll, false);
            window.addEventListener("keydown", onKeyDown, false);
        },

        /**
         * Returns the last accumulated rotatoion on X axis
         * @name CanvasController#getLatestTargetRotationX
         * @function
         *
         * @returns {Integer} targetRotationX  Amount of rotation along x axis in degrees.
         */
        getLatestTargetRotationX: function() {
            return targetRotationX;
        },

        /**
         * Returns the last accumulated rotation on Y axis
         * @name CanvasController#getLatestTargetRotationY
         * @function
         *
         * @returns {Integer} targetRotationY  Amount of rotation along y axis in degrees.
         */
        getLatestTargetRotationY: function() {
            return targetRotationY;
        },

        /**
         * Returns the last accumulated movement along X axis
         * @name CanvasController#getLatestMoveX
         * @function
         *
         * @returns {Integer} getLatestMoveX  Amount of movement along x axis in pixels.
         */
        getLatestMoveX: function() {
            return getLatestMoveX;
        },

        /**
         * Returns the last accumulated movement along Z axis
         * @name CanvasController#getLatestMoveZ
         * @function
         *
         * @returns {Integer} getLatestMoveZ  Amount of movement along z axis in pixels.
         */
        getLatestMoveZ: function() {
            return getLatestMoveZ;
        }
    }
});
