/** 
 * Class containing listeners for events concerning HTML elements, buttons and inputs.
 * This class creates listeners which act on events of the user with the GUI, and sets values which are
 * retrieved from the {@link Main} class.
 * @name ManoeuvreController
 * @class ManoeuvreController
 * @constructor
 */
define(['TubeEvents'],function(TubeEvents) {
    var tube;
    var tubeMesh;

    /**
     * Creates an object that represents a 3D model of a manoeuvre. Creates a mesh based on colour, and adds
     * this to the scene (parent).
     * @name Main#addGeometry
     * @function
     *
     * @param {TubeGeometry} geometry  Geometry of a move, used to build up the tube
     * @param {Hex} colour  Hexadecimal colour code
     */
    function addGeometry(geometry, color, parent) {
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
        scale = parseInt($('#scale').val());
        tubeMesh.scale.set(scale, scale, scale);
    }



    return {
        getTube: function() {
            return tube;
        },
        getTubeMesh: function() {
            return tubeMesh;
        },
        /**
         * Function responsible for creating geometry lines based on an array of instructions. Combines this with
         * interopobility to smooth out edges. Gets parameters from GUI options to set segment/ radius sengment amounts.
         * Creates geometry and then passes to tube constructor.
         * @name Main#addTube
         * @function
         *
         * @param {Manoeuvre} manoeuvre  Object represting a move, containing name, description and instructions
         */
        addTube: function(value, parent) {
            var segments = parseInt($('#segments').val());
            var closed2 = $('#closed').is(':checked');
            var radiusSegments = parseInt($('#radiusSegments').val());
           // console.log(value["olan"])
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
