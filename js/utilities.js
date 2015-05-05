/** 
 * Holds some helper methods for the application to reduce amount of code in other modules, 
 * and allow re-usability of functions.
 * @name Utilities
 * @class Utilities
 * @constructor
 */
define(function() {
	var jsonManoeuvreKey = 'manoeuvres';
	
	return {
		/**
		 * Takes the maneouvre input from the user and produces raw JSON using
		 * the JSON key in the private variables.
		 * @name Utilities#convertManoeuvresToJSON
		 * @function
		 *
		 * @param {String} manoeuvres  String input of OLAN.
		 * @returns {JSON} json  Raw JSON representing OLAN input.
		 */
		convertManoeuvresToJSON: function(manoeuvres) {
			var json = {}
			json[jsonManoeuvreKey] = manoeuvres;
			return json;
		},

		/**
		 * Retreives the maneouvre input from the JSON file using the key defined 
		 * in this modules private variable.
		 * @name Utilities#convertJSONToManoeuvres
		 * @function
		 *
		 * @param {JSON} json  Raw JSON representing OLAN input.
		 * @returns {String} manoeuvres  String input of OLAN.
		 */
		convertJSONToManoeuvres: function(json) {
			return json[jsonManoeuvreKey];
		},

		/**
		 * Initiates the download of the JSON file containing the user's OLAN input.
		 * @name Utilities#startDownload
		 * @function
		 *
		 * @param {JSON} json  Raw JSON containing OLAN input. 
		 * @param {Element} element  Element that initiates the download in the browser. 
		 */
		startDownload: function(json, element) {
			var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
            element.setAttribute("href", "data:" + data);
            element.setAttribute("download", "data.json");
		},

		/**
		 * Loads up a texture form an image and returns it as a ThreeJS.Texture.
		 * @name Utilities#loadTexture
		 * @function
		 *
		 * @param {String} objPath  Path to image representing texture.
		 * @returns {THREE.Texture} texture  Three.JS texture for use on objects or meshes.
		 */
		loadTexture: function(objPath) {
			var texture = THREE.ImageUtils.loadTexture(objPath);
			return texture;
		},

		/**
		 * Checks if a given set of letters contains any uppper case, if so, return true.
		 * @name Utilities#hasUpperCase
		 * @function
		 *
		 * @param {String} str  A String to be checked if it contains upper case letters
		 * @returns {Boolean} bool  Variable indicating whether there are any upper case letters present.
		 */
		hasUpperCase: function(str) {
		    return (/[A-Z]/.test(str));
		}
	}
});