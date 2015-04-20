/** 
 * Class for saving and loading manoeuvre strings. Can use local storage as well as allowing inputs from JSON,
 * and exports to JSON/ Local storage.
 * @name exportImportProjects
 * @class exportImportProjects
 * @constructor
 */
define(['htmlHandler', 'utilities'], function(HtmlHandler, Utilites) {
	var movesString = "";
    function checkLocalStoragePermitted() {
        if (typeof(Storage) != "undefined")
            return true;
        else
            return false;
    }

    return {
        /**
         * Enables and disables the input box in the header of the page to ensure user can only type when
         * permitted. Useful for blocking input when models and other JSON is being loaded.
         * @name HtmlHandler#enableOLANInput
         * @function
         *
         * @param {Boolean} enable  Boolean flag for enabling/ disabling OLAN input field
         */
        exportToJSON: function(manoeuvres, element) {
            var json = Utilites.convertManoeuvresToJSON(manoeuvres); 
            Utilites.startDownload(json, element);
        },

        exportToLocalStorage: function(manoeuvres) {
            if (checkLocalStoragePermitted()) {
                localStorage.setItem("manoeuvres", manoeuvres);
            }
        },

        setAutoLoadLocal: function(autoLoad) {
            if (checkLocalStoragePermitted()) {
                // Store
                localStorage.setItem("autoLoad", autoLoad);
            }
        },

        importFromJSON: function(file) {
            if (file == null)
                return "";
            if (file) {
                var r = new FileReader();
                r.onloadend = function(e) {
                    var contents = e.target.result;
                    obj = JSON.parse(contents);
                    movesString = Utilites.convertJSONToManoeuvres(obj);
                };
                r.readAsText(file);
            }
        },

        getJSONImport: function() {
        	return movesString;
        },

        importFromLocalStorage: function() {
            if (checkLocalStoragePermitted()) {
                // Retrieve
                var manoeuvres = localStorage.getItem("manoeuvres");
                return manoeuvres;
            }
            return "";
        },

        getAutoLoadLocal: function() {
            if (checkLocalStoragePermitted()) {
                var autoLoad = (localStorage.getItem("autoLoad") === 'true');
                return autoLoad;
            }
            return false;
        }
    }
});
