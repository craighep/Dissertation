/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name Terrain
 * @class Terrain
 * @constructor
 */
define(function() {

	return {
	    /**
	     * Creates the ground grass-effect that covers a large area enough for a reasonable amount of
	     * manoeuvres. Places the ground at a slightly lower level than 0 on Y axis for plane to look grounded.
	     * @name Terrain#createGround
	     * @function
	     *
	     * @returns {Mesh} ground  Ground object covering large area using grass image
	     */
	    createGround: function() {
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
	    },

	    /**
	     * Creates and returns a directional light that lights up the scene and aeroplane. Colour and positon of light
	     * affects appearence.
	     * @name Terrain#setupLight
	     * @function
	     *
	     * @returns {DirectionalLight} light  Light directed from a specified position
	     */
	    setupLight: function() {
	        var light = new THREE.DirectionalLight(0xffffff);
	        light.position.set(500, 1000, 1);
	        return light;
	    }
	}
});
