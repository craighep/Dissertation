define(['events', 'html'], function (events, html) {

	var container, stats;
	var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
	var text, plane;

	var binormal = new THREE.Vector3();
	var normal = new THREE.Vector3();

	extrudePath = new THREE.Curves.TrefoilKnot();

	var closed2 = false;
	var parent;
	var tube, tubeMesh;
	var animation = false,
	    lookAhead = false;
	var scale;
	var showCameraHelper = false;

	function addTube() {
	    var value = document.getElementById('dropdown').value;
	    var segments = parseInt(document.getElementById('segments').value);
	    closed2 = document.getElementById('closed').checked;
	    var radiusSegments = parseInt(document.getElementById('radiusSegments').value);
	  	console.log('adding tube', value, closed2, radiusSegments);
	    if (tubeMesh)
				 parent.remove(tubeMesh);
	    extrudePath = splines[value];
	    tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);
	    addGeometry(tube, 0xff00ff);
	    setScale();
	}

	function setScale() {
	    scale = parseInt(document.getElementById('scale').value);
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

	function animateCamera(toggle) {

	    if (toggle) {
	        animation = animation === false;
	        document.getElementById('animation').value = 'Camera Spline Animation View: ' + (animation ? 'ON' : 'OFF');
	    }
	    lookAhead = document.getElementById('lookAhead').checked;
	    showCameraHelper = document.getElementById('cameraHelper').checked;
	    cameraHelper.visible = showCameraHelper;
	    cameraEye.visible = showCameraHelper;
	}


	init();
	animate();

	function init() {

	    container = document.createElement('div');
	    document.body.appendChild(container);
	    var info = html.getInfo();
		  container.appendChild(info);
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
	    addTube();
	    // Debug point
	    cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({
	        color: 0x8B0000
	    }));
	    parent.add(cameraEye);
	    cameraHelper.visible = showCameraHelper;
	    cameraEye.visible = showCameraHelper;
	    renderer = new THREE.WebGLRenderer({
	        antialias: true
	    });
	    renderer.setClearColor(0xf0f0f0);
	    renderer.setPixelRatio(window.devicePixelRatio);
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    container.appendChild(renderer.domElement);
	    /*stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );*/
			events.init(renderer);

			document.getElementById('dropdown').onchange = function () {
				addTube(this.value);
			}
			document.getElementById('radiusSegments').onchange = addTube;
			document.getElementById('closed').onchange = addTube;
			document.getElementById('segments').onchange = addTube;
			document.getElementById('scale').onchange = setScale;
			document.getElementById('lookAhead').onchange = animateCamera;
			document.getElementById('cameraHelper').onchange = animateCamera;
			document.getElementById('animation').onclick = function () {
				 animateCamera(true);
			}
	}





	function animate() {
	    requestAnimationFrame(animate);
	    render();
	    //stats.update();
	}

	function render() {
	    // Try Animate Camera Along Spline
	    var time = Date.now();
	    var looptime = 20 * 1000;
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
	    cameraHelper.update();
	    parent.rotation.y += (events.getLatestTargetRotationX() - parent.rotation.y) * 0.05;
	    parent.rotation.x += (events.getLatestTargetRotationY() - parent.rotation.x) * 0.05;
	    renderer.render(scene, animation === true ? splineCamera : camera);
	}
});
