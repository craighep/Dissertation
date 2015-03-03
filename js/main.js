/** 
 * Main runnable class.
 * This is the main class for general communication to other modules,
 * and in charge of overall animation, and represnting manoeuvres on the WebGL scene.
 * @name Main
 * @class Main
 * @constructor
 */
define(['events', 'html', 'jquery', 'tubeEvents', 'parseJson'], function(Events, Html, $, TubeEvents, ParseJson) {


    /** @global */
    var container, stats;
    var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();
    var parent;
    var tube, tubeMesh;
    var onboard = false,
        showCameraHelper = false;
        lookAhead = false,
        paused = true;
    var scale;
    var speed = 20;

    /**
     * Function responsible for creating geometry lines based on an array of instructions. Combines this with
     * interopobility to smooth out edges. Gets parameters from GUI options to set segment/ radius sengment amounts.
     * Creates geometry and then passes to tube constructor.
     * @name Main#addTube
     * @function
     *
     * @param {Manoeuvre} manoeuvre  Object represting a move, containing name, description and instructions
     */
    function addTube(value) {
        var segments = parseInt($('#segments').val());
        var closed2 = $('#closed').is(':checked');
        var radiusSegments = parseInt($('#radiusSegments').val());
        console.log(value["olan"])
        var extrudePath = splines[TubeEvents.getTubes(value["olan"])];
        tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);


        if (tubeMesh !== undefined)
            parent.remove(tubeMesh);
        addGeometry(tube, 0xff00ff);
        setScale();
        if (radiusSegments == 0)
            tubeMesh.visible = false;
    }

    /**
     * Sets the scale of the manoeuvre based on the input in the GUI controls. Can be from 1 to 8 multiplied.
     *
     * @name Main#setScale
     * @function
     */
    function setScale() {
        scale = parseInt($('#scale').val());
        tubeMesh.scale.set(scale, scale, scale);
    }

    /**
     * Creates an object that represents a 3D model of a manoeuvre. Creates a mesh based on colour, and adds
     * this to the scene (parent).
     * @name Main#addGeometry
     * @function
     *
     * @param {TubeGeometry} geometry  Geometry of a move, used to build up the tube
     * @param {Hex} colour  Hexadecimal colour code
     */
    function addGeometry(geometry, color) {
        // 3d shape
        tubeMesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, [
            new THREE.MeshLambertMaterial({
                color: color
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                opacity: 0.3,
                wireframe: true,
                transparent: true
            })
        ]);
        parent.add(tubeMesh);
    }

    /**
     * Toggles the visibilty of the camera (aeroplane) to true or false. Also gets the value of the
     * look-ahead checkbox to set this on update of the scene.
     * @name Main#showCamera
     * @function
     *
     * @param {Boolean} toggle  Turns camera view on or off
     */
    function showCamera(toggle) {
        lookAhead = $('#lookAhead').is(':checked');
        showCameraHelper = $('#cameraHelper').is(':checked');
        cameraHelper.visible = toggle;
        cameraEye.visible = toggle;
    }

    /**
     * Sets the speed of the animation of the flight based on number of seconds. Range is from 40 to 1.
     * @name Main#setSpeed
     * @function
     *
     */
    function setSpeed() {
        speed = 41 - $('#speed').val(); // opposite becasue bigger means slower in terms of time
    }

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
     * Creates the ground grass-effect that covers a large area enough for a reasonable amount of
     * manoeuvres. Places the ground at a slightly lower level than 0 on Y axis for plane to look grounded.
     * @name Main#createGround
     * @function
     *
     * @returns {Mesh} ground  Ground object covering large area using grass image
     */
    function createGround() {
        var grassTex = THREE.ImageUtils.loadTexture('img/grass.png');
        grassTex.wrapS = THREE.RepeatWrapping;
        grassTex.wrapT = THREE.RepeatWrapping;
        grassTex.repeat.x = 500;
        grassTex.repeat.y = 500;
        var groundMat = new THREE.MeshBasicMaterial({
            map: grassTex
        });
        var groundGeo = new THREE.PlaneBufferGeometry(5000, 5000);
        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -1.9; //lower it
        ground.rotation.x = -Math.PI / 2; //-90 degrees around the xaxis
        ground.doubleSided = true;
        return ground;
    }

    /**
     * Creates and returns a directional light that lights up the scene and aeroplane. Colour and positon of light
     * affects appearence.
     * @name Main#setupLight
     * @function
     *
     * @returns {DirectionalLight} light  Light directed from a specified position
     */
    function setupLight() {
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(500, 1000, 1);
        return light;
    }

    /**
     * Creates the 3D object to be added to by any the manoeuvre mesh. Can be added to and removed like an array.
     * @name Main#setupParent
     * @function
     *
     */
    function setupParent() {
        parent = new THREE.Object3D();
        parent.position.y = 0;
    }

    /**
     * Sets up the scene, and calls the ground and light to be added. Adds the scene to the entire 3D object parent.
     * @name Main#setupScene
     * @function
     *
     */
    function setupScene() {
        scene = new THREE.Scene();
        var ground = createGround();
        var light = setupLight();
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
     * Sets up two cameras, one for animating along the maneouvre path, and one for looking at a further away
     * aspect. Both cameras view the whole scene based on the window height and width. Both are added to plane.
     * @name Main#setupCameras
     * @function
     *
     */
    function setupCameras() {
        splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 5000);
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
        camera.position.set(0, 50, 500);
        parent.add(splineCamera);
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
    function setupCameraEye() {
        var loader = new THREE.ObjectLoader();
        loader.load("js/models/plane.json", function(obj) {
            cameraEye = obj;
            cameraEye.visible = true;
            cameraEye.rotation.x = 0;
            cameraEye.rotation.y = 0;
            cameraEye.rotation.z = 0;
            parent.add(cameraEye);
        });
    }

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
        setupCameras(); // create standard and onboard cameras
        setupCameraHelper();
        setupCameraEye();
        setupRenderer();
        ParseJson.init();
        Html.addContent(renderer); // add options for dropdown 
        stats = new Stats();
        Html.addStatsBar(stats);
        Html.addHelpManoeuvreList(ParseJson.getManoeuvreArray());
        Events.init(renderer, camera); // setup event listeners for canvas movements
        initContolEvents(); // setup listeners for changes to controls
        animate();
    })();

    /**
     * Sets up listeners for GUI controls. Each listener links to its own event, onclick, on change and
     * on key events where the user types into the OLAN box.
     * @name Main#initContolEvents
     * @function
     *
     */
    function initContolEvents() {
        $('#rdropdown').change(function() {
            addTube(this.value);
        });
        $('#radiusSegments').change(refreshScene);
        $('#closed').change(refreshScene);
        $('#segments').change(refreshScene);
        $('#scale').change(setScale);
        $('#lookAhead').change(showCamera);
        $('#cameraHelper').change(showCamera);
        $('#onboard').change(function() {
            setOnboardCamera(!onboard);
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
     * Pauses the animation for the plane. Movement is still animated though.
     * Also changes the html button src on a toggle basis.
     * @name Main#pause
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

    /**
     * Resets the aeroplane loaction and rotation, the movie reel, manoeuvres shown and camera each time
     * it is triggered by either a change in the OLAN entered, or an appearence change. Means that problems
     * caused by changing any effects while animating is ongoing are avoided.
     * @name Main#refreshScene
     * @function
     *
     */
    function refreshScene() {
        var manoeuvres = [];
        manoeuvres = ParseJson.parseManoeuvreInput();
        pause(true);
        cameraEye.position.set(0, 0, 0);
        cameraEye.rotation.x = 0;
        cameraEye.rotation.y = 0;
        cameraEye.rotation.z = 0;
        if (manoeuvres.length < 1) {
            showCamera(true);
            parent.remove(tubeMesh);
        } else {
            showCamera(true);

            for (m in manoeuvres) {
                addTube(manoeuvres[m]);
            }
        }
        Html.addMoveReel(manoeuvres);
        setOnboardCamera(false);
        renderer.render(scene, onboard === true ? splineCamera : camera);
        animate();
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
        if (!paused)
            renderPlane();

        scene.rotation.y += (Events.getLatestTargetRotationX() - scene.rotation.y) * 0.6;
        scene.rotation.x += (Events.getLatestTargetRotationY() - scene.rotation.x) * 0.6;
        scene.position.x += (Events.getLatestMoveX() - scene.position.x);
        scene.position.z += (Events.getLatestMoveZ() - scene.position.z);
        renderer.render(scene, onboard === true ? splineCamera : camera);
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
        var time = Date.now();
        var looptime = speed * 1000;
        var t = (time % looptime) / looptime;
        var pos = tube.parameters.path.getPointAt(t);
        pos.multiplyScalar(scale);
        // interpolation
        var segments = tube.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

        var dir = tube.parameters.path.getTangentAt(t);

        var offset = 15;
        normal.copy(binormal).cross(dir);
        // We move on a offset on its binormal
        pos.add(normal.clone().multiplyScalar(offset));
        splineCamera.position.copy(pos);
        cameraEye.position.copy(pos);
        // Camera Orientation 1 - default look at
        var lookAt = tube.parameters.path.getPointAt((t + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);
        // Camera Orientation 2 - up orientation via normal
        if (!lookAhead)
            lookAt.copy(pos).add(dir);
        splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
        cameraEye.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
        cameraEye.rotation.z += 90;
    }
});
