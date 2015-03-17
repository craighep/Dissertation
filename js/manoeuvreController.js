/** 
 * Class that contstructs the tube and tube mesh from the array of manoeuvres parsed from user input.
 * the {@link ManoeuvreController#addTube} method loops through the OLAN moves entererd, and breaks these
 * down to their instructions, and creates an overall tube. This class is a subclass of {@link AnimationController}.
 * @name ManoeuvreController
 * @class ManoeuvreController
 * @constructor
 */
define(['tubeEvents'], function(TubeEvents) {
    var tube = [];
    var tubeMesh = [];
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
        var i = tubeMesh.length;
        tubeMesh[i] = new THREE.SceneUtils.createMultiMaterialObject(geometry, [
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
        parent.add(tubeMesh[i]);
        scale = parseInt($('#scale').val());
        tubeMesh[i].scale.set(scale, scale, scale);
    }

    function removeTubes(parent) {
        for (var a = 0; a < tubeMesh.length; a++) {
            if (tubeMesh[a] !== undefined)
                parent.remove(tubeMesh[a]);
        }
        tube = [];
        tubeMesh = [];
    }

    function createTube(extrudePath, segments, radiusSegments, parent) {
        var newTube = new THREE.TubeGeometry(extrudePath, segments, 2, 2, false);
        addGeometry(newTube, 0xff00ff, parent);
        tube[tube.length] = newTube;
        if (radiusSegments == 0)
            tubeMesh[tubeMesh.length].visible = false;
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
        addTube: function(values, parent) {
            var segments = parseInt($('#segments').val());
            var closed2 = $('#closed').is(':checked');
            var backup = $('#backup').is(':checked');
            var radiusSegments = parseInt($('#radiusSegments').val());
            var startVector = new THREE.Vector3(0, 0, 0);
            var linePoints = [startVector];
            var angleDiv = 12;

            removeTubes(parent);
            if (!backup) {

                for (m in values) {

                        var components = values[m]["components"];

                        for (var i = 0; i < components.length; i++) {
                            var component = components[i];
                            var prevVector = new THREE.Vector3(0, 0, 0);
                            if (linePoints.length > 0)
                                prevVector.copy(linePoints[linePoints.length - 1]);
                            if (component.PITCH == 0 && component.YAW == 0 && component.ROLL == 0) {
                                // var extrudePath = new THREE.SplineCurve3(linePoints);
                                // createTube(extrudePath, segments, radiusSegments, parent);
                                // startVector.copy(prevVector);
                                // var linePoints = [startVector];

                                prevVector.setZ(prevVector.z + (component.LENGTH * 10));
                                linePoints.push(prevVector);
                            } else {
                                var axis = new THREE.Vector3(1, 0, 0);
                                var angle = Math.PI / 180 * angleDiv * -component.PITCH;
                                prevVector.applyAxisAngle(axis, angle);

                                var axis = new THREE.Vector3(0, 1, 0);
                                var angle = Math.PI / 180 * angleDiv * component.YAW;
                                prevVector.applyAxisAngle(axis, angle);
                                prevVector.setZ(prevVector.z + (component.LENGTH * 10));
                                linePoints.push(prevVector);
                            }
                        }
                        var startVector = new THREE.Vector3(0, 0, 0);
                        startVector.copy(prevVector);
                        linePoints.push(startVector);
                        console.log(linePoints);
                    }
                        var extrudePath = new CustomSplineCurve(linePoints);
                        createTube(extrudePath, segments, radiusSegments, parent);
                
            }
             else { // for project demo if all is broken
                        var extrudePath = splines[TubeEvents.getTubes(values[0]["olan"])];
                        createTube(extrudePath, segments, radiusSegments, parent);
            }
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
        removeTube: function(parent) {
            removeTubes(parent);
        }
    }
});
