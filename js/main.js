define(['events', 'html', 'jquery', 'tube_events'], function(events, html, $, tubeEvents) {

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

    function addTube(value) {
        var segments = parseInt($('#segments').val());
        var closed2 = $('#closed').is(':checked');
        var radiusSegments = parseInt($('#radiusSegments').val());
        var extrudePath = splines[value];
        tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);
        
            
        if (tubeMesh !== undefined )
            parent.remove(tubeMesh)
        addGeometry(tube, 0xff00ff);
        setScale();
        if (radiusSegments == 0)
        tubeMesh.visible = false;
    }

    function setScale() {
        scale = parseInt($('#scale').val());
        tubeMesh.scale.set(scale, scale, scale);
    }

    function addGeometry(geometry, color) {
        // 3d shape
        tubeMesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
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

		function showCamera(toggle)	{
			lookAhead = $('#lookAhead').is(':checked');
			showCameraHelper = $('#cameraHelper').is(':checked');
			cameraHelper.visible = toggle;
			cameraEye.visible = toggle;
		}

    function setSpeed(){
      speed = 41 - $('#speed').val(); // opposite becasue bigger means slower in terms of time
    }

    function setOnboardCamera(toggle) {
            onboard = toggle;
            $('#onboardLabel').html('Camera onboard view: ' + (toggle ? 'ON' : 'OFF'));
        }

    init();

    function createGround() {
    	//add ground 
		var grassTex = THREE.ImageUtils.loadTexture('img/grass.png'); 
		grassTex.wrapS = THREE.RepeatWrapping; 
		grassTex.wrapT = THREE.RepeatWrapping; 
		grassTex.repeat.x = 500; 
		grassTex.repeat.y = 500; 
		var groundMat = new THREE.MeshBasicMaterial({map:grassTex}); 
		var groundGeo = new THREE.PlaneBufferGeometry(5000,5000); 
		var ground = new THREE.Mesh(groundGeo,groundMat); 
		ground.position.y = -1.9; //lower it 
		ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis 
		//IMPORTANT, draw on both sides 
		ground.doubleSided = true; 
		scene.add(ground); 
    }

    function setupParent() {
      parent = new THREE.Object3D();
      parent.position.y = 0;
    }

    function setupScene(){
      scene = new THREE.Scene();
      createGround();
      var light = new THREE.DirectionalLight(0xffffff);
      light.position.set(500, 1000, 1);
      scene.add(light);
      scene.add(parent);
    }

    function setupRenderer(){
      renderer = new THREE.WebGLRenderer({
          antialias: true
      });
      renderer.setClearColor(0xf0f0f0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }

    function setupCameras() {
        splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 5000);
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
        camera.position.set(0, 50, 500);
    }

    function setupCameraHelper() {
      cameraHelper = new THREE.CameraHelper(splineCamera);
      cameraHelper.visible = showCameraHelper;
    }

    function setupCameraEye() {
      var loader = new THREE.ObjectLoader();
        loader.load("js/models/plane.json",function ( obj ) {
        cameraEye = obj;
        cameraEye.visible = true;
        cameraEye.rotation.x = 0;
	    cameraEye.rotation.y = 0;
	    cameraEye.rotation.z = 0;
        parent.add(cameraEye);
      });
    }

    function init() {
        setupParent(); // Creates 3D Object
        setupScene(); // Creates scene and adds object
        setupCameras(); // create standard and onboard cameras
        parent.add(splineCamera);
        setupCameraHelper();
        setupCameraEye();
        setupRenderer();
        html.addContent(renderer); // add options for dropdown
        events.init(renderer, camera); // setup event listeners for canvas movements
        initContolEvents(); // setup listeners for changes to controls
        animate();
    }

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

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function pause(p) {
        paused = p;
        var imgUrl = "img/"
        $('#pause').css({
            "background-image": "url(" + imgUrl + (paused ? "play" : "pause") + ".png)"
        });
    }

    function refreshScene() {
      tubes = tubeEvents.getTubes();
      pause(true);
      cameraEye.position.set(0,0,0);
      cameraEye.rotation.x = 0;
      cameraEye.rotation.y = 0;
      cameraEye.rotation.z = 0;
      if (tubes.length === 0) {
          showCamera(true);
          parent.remove(tubeMesh);
      } else {
          showCamera(true);
          for (t in tubes) {
              addTube(tubes[t]);
          }
      }
      html.addMoveReel(tubes);
      setOnboardCamera(false);
      renderer.render(scene, onboard === true ? splineCamera : camera);
      animate();
    }

    function render() {
        if (!paused)
          renderPlane();

        scene.rotation.y += (events.getLatestTargetRotationX() - scene.rotation.y) * 0.6;
        scene.rotation.x += (events.getLatestTargetRotationY() - scene.rotation.x) * 0.6;
		scene.position.x += (events.getLatestMoveX() - scene.position.x);
		scene.position.z += (events.getLatestMoveZ() - scene.position.z);
        renderer.render(scene, onboard === true ? splineCamera : camera);
    }

    function renderPlane(){
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
 //    cameraHelper.update();
    }
});
