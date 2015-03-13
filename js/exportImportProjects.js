/** 
 * Class for saving and loading manoeuvre strings. Can use local storage as well as allowing inputs from JSON,
 * and exports to JSON/ Local storage.
 * @name exportImportProjects
 * @class exportImportProjects
 * @constructor
 */
define(['htmlHandler'], function(HtmlHandler) {
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
        exportToJSON: function(manoeuvres, el) {
            var m = {
                "manoeuvres": manoeuvres
            };
            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(m));
            el.setAttribute("href", "data:" + data);
            el.setAttribute("download", "data.json");
        },

        exportToLocalStorage: function(manoeuvres) {
            if (checkLocalStoragePermitted()) {
                if (!localStorage.getItem("autoLoad"))
                    return;
                // Store
                localStorage.setItem("manoeuvres", manoeuvres);
            }
        },

        setAutoLoadLocal: function(autoLoad) {
            if (checkLocalStoragePermitted()) {
                // Store
                localStorage.setItem("autoLoad", autoLoad);
            }
        },

        importFromJSON: function(evt) {
            var f = evt.files[0];
            if (f == null)
                return "";
            if (f) {
                var r = new FileReader();
                r.onloadend = function(e) {
                    var contents = e.target.result;
                    obj = JSON.parse(contents);
                    movesString = obj['manoeuvres'];
                };
                r.readAsText(f);
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
