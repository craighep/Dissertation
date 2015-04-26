/** 
 * Main runnable class.
 * This is the main class for general communication to other modules,
 * and in charge of overall animation, and represnting manoeuvres on the WebGL scene.
 * @name Main
 * @class Main
 * @constructor
 */
define(['canvasController', 'htmlHandler', 'parseJson', 'animationController', 'cameraController', 'terrain'], 
    function(CanvasController, HtmlHandler, ParseJson, AnimationController, CameraController, Terrain) {

    var stats;
    var scene, renderer;
    var parent;
    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    /**
     * Initial function, starts all critical modules, including scene, objects, event listeners and html events.
     * Self-calling function runs on startup, and after modules are loaded the animation begins and allows for
     * user interaction.
     * @name Main#init
     * @function
     *
     */
    (function() {
        setupParent(); // Creates 3D Object
        setupScene(); // Creates scene and adds object
        setupRenderer();
        CameraController.initCameras(parent);
        ParseJson.init();
        stats = HtmlHandler.addStatsBar();
        var manoeuvres = ParseJson.getManoeuvreArray();
        HtmlHandler.addContent(renderer, manoeuvres); // add options for dropdown 
        HtmlHandler.addHelpManoeuvreList(manoeuvres);
        CanvasController.init(renderer, CameraController.getStandardCamera()); // setup event listeners for canvas movements
        AnimationController.initControlEvents(renderer, CameraController, parent); // setup listeners for changes to controls
        animate();
    })();

    /**
     * Creates the 3D object to be added to by any the manoeuvre mesh. Can be added to and removed like an array.
     * @name Main#setupParent
     * @function
     *
     */
    function setupParent() {
        parent = new THREE.Object3D();
        parent.position.y = 0;
        parent.rotateOnAxis(new THREE.Vector3(0, 1, 0),  Math.PI / 2 );
    }

    /**
     * Sets up the scene, and calls the ground and light to be added. Adds the scene to the entire 3D object parent.
     * @name Main#setupScene
     * @function
     *
     */
    function setupScene() {
        scene = new THREE.Scene();
        var ground = Terrain.createGround();
        var light = Terrain.setupLight();
        scene.add(light);
        scene.add(ground);
        scene.add(parent);
    }

    /**
     * Creates the renderer (container) of the WebGL scene, and sets size of it, background and pixel ratio.
     * @name Main#setupRenderer
     * @function
     *
     */
    function setupRenderer() {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0xf0f0f0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    }

    /**
     * Starts the animation of the scene, and is self-calling. Repeats itself to allow for user to move
     * and rotate the scene, so it can reflect this in the view. Also calls the statistics update method
     * to allow for it to track the speed of animation in the browser.
     * @name Main#animate
     * @function
     *
     */
    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    /**
     * Renderes the scene with the camera, to allow for the the scene to be looked at from different angles.
     * Uses the event class to get the rotation required to be done to the scene from the last time the
     * user dragged the scene in an X or Y axis mean.
     * @name Main#render
     * @function
     *
     */
    function render() {
        if (!AnimationController.getIsPaused())
            renderPlane();

        scene.rotation.y += (CanvasController.getLatestTargetRotationX() - scene.rotation.y) * 0.6;
        scene.rotation.x += (CanvasController.getLatestTargetRotationY() - scene.rotation.x) * 0.6;
        scene.position.x += (CanvasController.getLatestMoveX() - scene.position.x);
        scene.position.z += (CanvasController.getLatestMoveZ() - scene.position.z);
        renderer.render(scene, CameraController.getIsOnboard() === true ? CameraController.getSplineCamera() : CameraController.getStandardCamera());
    }

    /**
     * Calculates where to place the aeroplane on the maneouvre path, based on the time. Sets cameras to
     * look in correct positions too, based on if the user chooses the look ahead option. Performs interpolation
     * on the different sections of each move, to make a smoother flight path.
     * @name Main#renderPlane
     * @function
     *
     */
    function renderPlane() {
        // Try Animate Camera Along Spline
        var scale = AnimationController.getScale();
        var time = AnimationController.getAnimateTime();
        HtmlHandler.updateMoveReel(time, ParseJson.parseManoeuvreInput().length);
        var count = 0;
        while(time > 1){
            time -= 1;
            count++;
        }
        var tube = AnimationController.getTube()[count];
        var pos = tube.parameters.path.getPointAt(time);
        var dir = tube.parameters.path.getTangentAt(time);
        pos.multiplyScalar(scale);
        //----------------------------------------------------------
        // interpolation
        var segments = tube.tangents.length;
        var pickt = time * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);
        
        var offset = 15;
        normal.copy(binormal).cross(dir);
        // Move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        CameraController.setSplineCameraPosition(pos);
        CameraController.setCameraEyePosition(pos);
        // Camera Orientation 1 - default look at
        var lookAt = tube.parameters.path.getPointAt((time + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
         if (!CameraController.getIsLookAhead())
         {
             lookAt.copy(pos).add(dir);
         }
        CameraController.setSplineCameraLookAt(lookAt, normal);
        CameraController.setRenderCamerasRotation();
        CameraController.addSmoke(parent);
    }
});
