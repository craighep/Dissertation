/** 
 * Camera handler class fro creating and modifyng cameras in the scene. This includes the
 * aeroplane, which is created from a model and added to the environment. Contains all the
 * initialisers for each camera, edit methdods, and get methods.
 * @name CameraController
 * @class CameraController
 * @constructor
 */
define(function() {

	var smoke = [];

	function createSmokeParticle(parent) {
        var geo = new THREE.BoxGeometry( 1, 2, 7 );
        var smokeParticle = new THREE.Mesh( geo, new THREE.MeshBasicMaterial({ color: "rgb(0,255,0)" }) );
        smokeParticle.material.transparent = true;
        parent.add( smokeParticle );
        smoke.push(smokeParticle);
        return smokeParticle;
    }

    function fadeSmoke(parent) {
        for(i in smoke) {
            smoke[i].material.opacity -=0.01;
        }
        if(smoke.length > 250){
            parent.remove(smoke.shift(), smoke.shift());
        }
    }

    function positionSmokeParticle(cube, alt, cameraEye, splineCamera) {
        cube.position.copy(cameraEye.position);
        cube.rotateOnAxis(new THREE.Vector3(0, 1, 0),  Math.PI );
        cube.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

        if (alt > 0)
            cube.position.x += 19;
        else 
            cube.position.x -= 19;
    }

    function colourSmokeParticle(cube){
        var degrees = cube.rotation.x * (180/Math.PI);
        
        if (degrees < 120 && degrees > -120)
        {   
            degrees = Math.abs(degrees)
            strength =  120 -degrees;
            var red = Math.round(255 / 120 * Math.abs(strength));
            var green = Math.round(255 - red);
            cube.material.color.set("rgb("+red+","+green+",0)");
        }
    }

	return {		
		updateSmoke: function(parent, cameraEye, splineCamera) {
            for(var alt =0; alt < 2; alt++) {
                var smokeParticle = createSmokeParticle(parent)
                positionSmokeParticle(smokeParticle, alt, cameraEye, splineCamera);
                colourSmokeParticle(smokeParticle);
            }
            fadeSmoke(parent);
        },

	    clearSmoke: function(parent){
	    	if (smoke.length < 1)
	    		return;
	        for(i in smoke) {
	            parent.remove(smoke[i]);
	        }
	        smoke = [];
	    }
	}
});