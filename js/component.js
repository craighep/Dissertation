/** 
 * Represents each component for 
 * @name ManoeuvreController
 * @class ManoeuvreController
 * @constructor
 */
define(function() {
	var YAW, PITCH, ROLL, LENGTH;
	return {
		Component: function(yaw, pitch, roll, length) {
			YAW = yaw;
			PITCH = pitch;
			ROLL = roll;
			LENGTH = length;
		}
	}    
});