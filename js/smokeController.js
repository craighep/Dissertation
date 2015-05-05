/** 
 * Moduel for controlling and creating the smoke trails when the aircraft flies around the canvas.
 * Perorms creation of smoke particles, the fading out of them, and the calculates the colour of the 
 * smoke based on the rottation of the aircraft. Deletes particles at the end of the trail after a certian
 * time to not clog up the canvas.
 * @name SmokeController
 * @class SmokeController
 * @constructor
 */
define(function() {

	var smoke = [];

    /**
     * A getter function for retreiving the entire list of manoeuvres.
     * @name SmokeController#createSmokeParticle
     * @function
     * 
     * @param {Parent} parent  The parent which the smoke is added to.
     * @returns {Mesh} smokeParticle  A mesh object represnting each particle of smoke.
     */
	function createSmokeParticle(parent) {
        var geo = new THREE.BoxGeometry( 1, 2, 7 );
        var smokeParticle = new THREE.Mesh( geo, new THREE.MeshBasicMaterial({ color: "rgb(0,255,0)" }) );
        smokeParticle.material.transparent = true;
        parent.add( smokeParticle );
        smoke.push(smokeParticle);
        return smokeParticle;
    }

    /**
     * Loops through all of of the smoke particles, and decreases the opacity of each one.
     * Then checks if the amount of particles has passed 250, if so, deletes the first one in the array.
     * @name SmokeController#fadeSmoke
     * @function
     * 
     * @param {Parent} parent  The parent which the smoke is removed from.
     */
    function fadeSmoke(parent) {
        for(var i in smoke) {
            smoke[i].material.opacity -=0.01;
        }
        if(smoke.length > 250){
            parent.remove(smoke.shift(), smoke.shift());
        }
    }

    /**
     * Function for placing the smoke onto the canvas, and setting the rotation of each particle to the 
     * same amount as the aircraft.
     * @name SmokeController#positionSmokeParticle
     * @function
     * 
     * @param {Mesh} cube  Individual smoke particle
     * @param {Integer} alt  Makes two smoke trails, so alternates between them each time.
     * @param {Object} cameraEye  The plane, to get the location.
     * @param {PerspectiveCamera} splineCamera  Used to get the current rotation along the animation.
     */
    function positionSmokeParticle(cube, alt, cameraEye, splineCamera) {
        cube.position.copy(cameraEye.position);
        cube.rotateOnAxis(new THREE.Vector3(0, 1, 0),  Math.PI );
        cube.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

        if (alt > 0){
            cube.position.x += 19;
            cube.position.y += 3;
        }
        else {
            cube.position.x -= 19;
            cube.position.y += 3;
        }
    }

    /**
     * Sets the colour of the smoke particles on the canvas, based on the current rotation of the aircraft. 
     * Red is intensified for upside down angles, green for normal rotation.
     * same amount as the aircraft.
     * @name SmokeController#colourSmokeParticle
     * @function
     * 
     * @param {Mesh} smokeParticle  Individual smoke particle
     */
    function colourSmokeParticle(smokeParticle){
        var degrees = smokeParticle.rotation.x * (180/Math.PI);
        
        if (degrees < 120 && degrees > -120)
        {   
            degrees = Math.abs(degrees)
            var strength =  120 -degrees;
            var red = Math.round(255 / 120 * Math.abs(strength));
            var green = Math.round(255 - red);
            smokeParticle.material.color.set("rgb("+red+","+green+",0)");
        }
    }

	return {
        /**
         * Updates the position and colour of smoke particles on the canvas. Does this twice
         * on each iteration, in order to malke 
         * @name SmokeController#colourSmokeParticle
         * @function
         * 
         * @param {Parent} parent  The canvas holding all the smoke particles.
         * @param {Object} cameraEye  The plane object on the canvas, used for setting location of smoke.
         * @param {PerspectiveCamera} splineCamera  The camera animating along the spline, for setting the rotation.
         */		
		updateSmoke: function(parent, cameraEye, splineCamera) {
            for(var alt =0; alt < 2; alt++) {
                var smokeParticle = createSmokeParticle(parent)
                positionSmokeParticle(smokeParticle, alt, cameraEye, splineCamera);
                colourSmokeParticle(smokeParticle);
            }
            fadeSmoke(parent);
        },

        /**
         * Deletes the smoe particles from the canvas when animation is complete, or changes to OLAn input are performed. 
         * @name SmokeController#clearSmoke
         * @function
         * 
         * @param {Parent} parent  The canvas holding all the smoke particles.
         */     
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