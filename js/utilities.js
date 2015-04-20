/** 
 * Class for saving and loading manoeuvre strings. Can use local storage as well as allowing inputs from JSON,
 * and exports to JSON/ Local storage.
 * @name exportImportProjects
 * @class exportImportProjects
 * @constructor
 */
define(function() {
	var jsonManoeuvreKey = 'manoeuvres';

	return {
		convertManoeuvresToJSON: function(manoeuvres) {
			var json = {}
			json[jsonManoeuvreKey] = manoeuvres;
			return json;
		},

		convertJSONToManoeuvres: function(json) {
			return json[jsonManoeuvreKey];
		},

		startDownload: function(json, element) {
			var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
            element.setAttribute("href", "data:" + data);
            element.setAttribute("download", "data.json");
		}
	}
});