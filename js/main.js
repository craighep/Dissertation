define(['events', 'html', 'jquery', 'tube_events'], function(events, html, $, tubeEvents) {

    var container, stats;
    var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
    var text, plane;

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    var closed2 = false;
    var parent;
    var tube, tubeMesh, extrudePath;
    var animation = false,
        lookAhead = false;
    var scale;
    var showCameraHelper = false;
    var paused = true;
    var moves = [1, 2, 3, 4];

    function addTube(value) {
        var segments = parseInt($('#segments').val());
        closed2 = $('#closed').is(':checked');
        var radiusSegments = parseInt($('#radiusSegments').val());
        if (tubeMesh)
            parent.remove(tubeMesh);
        extrudePath = splines[value];
        tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);
        addGeometry(tube, 0xff00ff);
        setScale();
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

    function animateCamera(toggle) {
        if (!toggle) {
            animation = animation === false;
            $('#animation').prop('value', 'Camera Animation View: ' + (toggle ? 'ON' : 'OFF'));
        }
    }

    init();

    function init() {
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(0, 50, 500);
        scene = new THREE.Scene();
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1);
        scene.add(light);
        parent = new THREE.Object3D();
        parent.position.y = 100;
        scene.add(parent);
        splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
        parent.add(splineCamera);
        cameraHelper = new THREE.CameraHelper(splineCamera);
        scene.add(cameraHelper);

        cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({
            color: 0x8B0000
        }));
        parent.add(cameraEye);
        cameraHelper.visible = showCameraHelper;
        cameraEye.visible = false;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0xf0f0f0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        html.addContent(renderer);
        events.init(renderer, camera);
        initHtmlEvents();

        renderer.render(scene, animation === true ? splineCamera : camera);
    }

    function initHtmlEvents() {
        $('#rdropdown').change(function() {
            addTube(this.value);
        });
        $('#radiusSegments').change(addTube);
        $('#closed').change(addTube);
        $('#segments').change(addTube);
        $('#scale').change(setScale);
        $('#lookAhead').change(showCamera);
        $('#cameraHelper').change(showCamera);
        $('#animation').onclick = function() {
            showCamera(false);
        }
        $('#pause').click(function() {
            pause(!paused); // Reverse current setting(pause / un-pause)
        });
        $('#about').click(function() {
            pause(true);
        });
        $('#help').click(function() {
            pause(true);
        });
        $("#input").keyup(function() {
            tubes = tubeEvents.getTubes();
						pause(true);
            if (tubes.length === 0) {
                showCamera(false);
                parent.remove(tubeMesh);
            } else {
                showCamera(true);
                for (t in tubes) {
                    addTube(tubes[t]);
                }
            }
            html.addMoveReel(tubes);
            renderer.render(scene, animation === true ? splineCamera : camera);
            animate();
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function pause(p) {
        paused = p;
        var imgUrl = "http://craighep.github.io/Dissertation/img/"
        $('#pause').css({
            "background-image": "url(" + imgUrl + (paused ? "play" : "pause") + ".png)"
        });
    }

    function render() {
        if (!paused)
          renderPlane();

        parent.rotation.y += (events.getLatestTargetRotationX() - parent.rotation.y) * 0.05;
        parent.rotation.x += (events.getLatestTargetRotationY() - parent.rotation.x) * 0.05;
        renderer.render(scene, animation === true ? splineCamera : camera);
    }

    function renderPlane(){
      // Try Animate Camera Along Spline
      var time = Date.now();
      var looptime = 20 * 1000;
      var t = (time % looptime) / looptime;
      //	console.log(t);
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
      console.log(pos);
      // Camera Orientation 1 - default look at
      var lookAt = tube.parameters.path.getPointAt((t + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);
      // Camera Orientation 2 - up orientation via normal
      if (!lookAhead)
          lookAt.copy(pos).add(dir);
      splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
      splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
      cameraHelper.update();
    }
});
