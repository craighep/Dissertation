/** 
 * Represents each component part of a manoeuvre. Each of these represent the translation to be done
 * in terms of rolling, turning left or right, and going up or down. The length of each translation is 
 * also provided.
 * @name Component
 * @class Component
 * @constructor
 */
define(function() {

	/**
     * Parses the JSON direction for each translation. Positive will reflect as adding 1, and negative as
     * translation minus 1. Default is 0, which means to stay on the same tradectory as the previous.
     * @name Component#parseDirectionContext
     * @function
     *
     * @param {String} dir  Direction string coming from raw JSON file
     * @returns {Integer} int  Translation to matrix value
     */
   	function parseDirectionContext(dir) {
   		switch (dir) {
         case "POS":
            return 1;
         case "NIL":
            return 0;
         case "NEG":
            return -1;
      }
      return 0;
   	}

	/**
	     * Creates a new component to be added to array of components within each manoeuvre.
	     * @name Component#component
	     * @function
	     *
	     * @param {String} yaw  Raw yaw value of component from JSON- turn left or right
	     * @param {String} pitch  Raw pitch value of component from JSON- go up or down
	     * @param {String} roll  Raw roll value of component from JSON- roll left or right
	     * @param {String} length  Raw length value of component from JSON- distance to travel
	     * @returns {Component} component  This object, which is used to translate manoevres
	     */
   function component(yaw, pitch, roll, length) {
		this.YAW = parseDirectionContext(yaw);
		this.PITCH = parseDirectionContext(pitch);
		this.ROLL = parseDirectionContext(roll);
		this.LENGTH = length;
   }

   component.prototype = {
   
   	function2: function () {

   	}
   };

   return component; 
});