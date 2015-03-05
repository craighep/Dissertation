/** 
 * Class that contstructs the tube and tube mesh from the array of manoeuvres parsed from user input.
 * the {@link ManoeuvreController#addTube} method loops through the OLAN moves entererd, and breaks these
 * down to their instructions, and creates an overall tube. This class is a subclass of {@link AnimationController}.
 * @name ManoeuvreController
 * @class ManoeuvreController
 * @constructor
 */
define(['tubeEvents'],function(TubeEvents) {
    var tube;
    var tubeMesh;

    /**
     * Creates an object that represents a 3D model of a manoeuvre. Creates a mesh based on colour, and adds
     * this to the scene (parent).
     * @name ManoeuvreController#addGeometry
     * @function
     *
     * @param {TubeGeometry} geometry  Geometry of a move, used to build up the tube
     * @param {Hex} colour  Hexadecimal colour code
     */
    function addGeometry(geometry, color, parent) {
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
        scale = parseInt($('#scale').val());
        tubeMesh.scale.set(scale, scale, scale);
    }

    return {
    	/**
	     * Creates an object that represents a 3D model of a manoeuvre. Creates a mesh based on colour, and adds
	     * this to the scene (parent).
	     * @name ManoeuvreController#addGeometry
	     * @function
	     *
	     * @returns {Hex} colour  Hexadecimal colour code
	     */
        getTube: function() {
            return tube;
        },
        /**
	     * Creates an object that represents a 3D model of a manoeuvre. Creates a mesh based on colour, and adds
	     * this to the scene (parent).
	     * @name ManoeuvreController#addGeometry
	     * @function
	     *
	     * @returns {Hex} colour  Hexadecimal colour code
	     */
        getTubeMesh: function() {
            return tubeMesh;
        },

        /**
         * Function responsible for creating geometry lines based on an array of instructions. Combines this with
         * interopobility to smooth out edges. Gets parameters from GUI options to set segment/ radius sengment amounts.
         * Creates geometry and then passes to tube constructor.
         * @name ManoeuvreController#addTube
         * @function
         *
         * @param {Manoeuvre} manoeuvre  Object represting a move, containing name, description and instructions
         */
        addTube: function(value, parent) {
            var segments = parseInt($('#segments').val());
            var closed2 = $('#closed').is(':checked');
            var radiusSegments = parseInt($('#radiusSegments').val());
            var components = value["component"];

            for (c in components){

            }
            var extrudePath = splines[TubeEvents.getTubes(value["olan"])];
            tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);


            if (tubeMesh !== undefined)
                parent.remove(tubeMesh);
            addGeometry(tube, 0xff00ff, parent);
            if (radiusSegments == 0)
                tubeMesh.visible = false;
        }
    }
});
