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
            var components = value["components"];
            var vector = new THREE.Vector3(0,0,0);
            var linePoints = [];
            var angleDiv = 12;

            for (var i = 0; i < components.length; i++){
                var component = components[i];
                var prevVector = new THREE.Vector3(0,0,0);
                if (linePoints.length > 0)
                    prevVector.copy(linePoints[ linePoints.length -1 ]);
                var axis = new THREE.Vector3( 1, 0, 0 );
                var angle = Math.PI / 180 * angleDiv * component.PITCH;
                console.log(angle);
                prevVector.applyAxisAngle( axis, angle );

                var axis = new THREE.Vector3( 0, 1, 0 );
                var angle = Math.PI / 180 * angleDiv * component.YAW;
                prevVector.applyAxisAngle( axis, angle );
                linePoints.push(prevVector);

                var lengthVector = new THREE.Vector3(0,0,0);
                lengthVector.copy(prevVector);
                lengthVector.setZ(lengthVector.z + (component.LENGTH*10));
                linePoints.push(lengthVector);
            }

            var spline = new THREE.SplineCurve3(linePoints);
            var extrudePath = spline;//splines[TubeEvents.getTubes(value["olan"])];
            tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);

            var geometry = new THREE.Geometry();
            var splinePoints = spline.getPoints(1000);

            for(var i = 0; i < splinePoints.length; i++){
                geometry.vertices.push(splinePoints[i]);  
            }

            var line = new THREE.Line(geometry);
            parent.add(line)

            if (tubeMesh !== undefined)
                parent.remove(tubeMesh);
            addGeometry(tube, 0xff00ff, parent);
            if (radiusSegments == 0)
                tubeMesh.visible = false;
        }
    }
});
