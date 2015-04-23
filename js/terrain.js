/** 
 * Responsible for creating the ground and light for the scene.
 * @name Terrain
 * @class Terrain
 * @constructor
 */
define(['utilities'], function(Utilities) {

	/**
     * Loads up the grass texture and sets this a texture for the ground.
     * @name Terrain#createGrass
     * @function
     *
     * @returns {Texture} grass  Grass texture for the ground.
     */
	function createGrass() {
		var grass = Utilities.loadTexture('img/grass.png');
        grass.wrapS = THREE.RepeatWrapping;
        grass.wrapT = THREE.RepeatWrapping;
        grass.repeat.x = 500;
        grass.repeat.y = 500;
        return grass;
	}

	/**
	 * Creates ground mesh plane to place in the scene. Applies the grass texture to it.
	 * Places the ground at a slightly lower level than 0 on Y axis for plane to look grounded.
	 * @name Terrain#createGroundMat
	 * @function
	 *
	 * @param {Texture} grass  Texture of the ground.
	 * @returns {Mesh} ground  Ground object covering large area using grass image.
	 */
	function createGroundMat(grass) {
		var groundMat = new THREE.MeshBasicMaterial({
	            map: grass
	        });
        var groundGeo = new THREE.PlaneBufferGeometry(5000, 5000);
        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -1.9; //lower it
        ground.rotation.x = -Math.PI / 2; //-90 degrees around the xaxis
        ground.doubleSided = true;
        return ground;
	}

	return {
	    /**
	     * Creates the ground grass-effect that covers a large area enough for a reasonable amount of
	     * manoeuvres.
	     * @name Terrain#createGround
	     * @function
	     *
	     * @returns {Mesh} ground  Ground object covering large area using grass image.
	     */
	    createGround: function() {
	    	var grass = createGrass();
	        var ground = createGroundMat(grass);
	        return ground;
	    },

	    /**
	     * Creates and returns a directional light that lights up the scene and aeroplane. Colour and positon of light
	     * affects appearence.
	     * @name Terrain#setupLight
	     * @function
	     *
	     * @returns {DirectionalLight} light  Light directed from a specified position.
	     */
	    setupLight: function() {
	        var light = new THREE.DirectionalLight(0xffffff);
	        light.position.set(500, 1000, 1);
	        return light;
	    }
	}
});
