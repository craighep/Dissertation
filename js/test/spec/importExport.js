// Load the import/export and utilities modules and describe tests.
define(
    [
        "../../exportImportProjects",
        "../../utilities",
        "../../animationController",
        "test/spec/testUtils"
    ],
    function( ExportImportProjects, Utilities, AnimationController, TestUtils ){
 
 
        // Describe the test suite for this module.
        describe(
            "Importing and exporting scenarios to JSON and to localstorage.",
            function(){
 
                // Shoule be able to export and import from local storage
                it(
                    "Exporting to and then importing from localStorage should work",
                    function(){
                        ExportImportProjects.exportToLocalStorage("o a b o");
                        expect( ExportImportProjects.importFromLocalStorage() ).toBe("o a b o");
                    }
                );
 
                // Should export manoeuvres to JSON from the scenario
                it(
                    "Should be able to export to JSON",
                    function(){
                        var manoeuvres = "o a b o";
                        var json = Utilities.convertManoeuvresToJSON(manoeuvres);
                        expect( manoeuvres ).toBe(json["manoeuvres"]);
                    }
                );
                
                // Should import manoeuvres from JSON to the scenario
                it(
                    "Should be able to import from JSON",
                    function(){
                        var manoeuvres = "o a b o";
                        var json = Utilities.convertManoeuvresToJSON(manoeuvres);
                        var result = Utilities.convertJSONToManoeuvres(json);
                        expect( result ).toBe(manoeuvres);
                    }
                );

                // Checks if local storage auto save switch correctly sets.
                it(
                    "Should be able to save change option of local storage on",
                    function(){
                        TestUtils.setUpAppend("<input id='autoSave' type='checkbox'>");
                        AnimationController.initControlEvents();
                        $('#autoSave').prop('checked', true);
                        $('#autoSave').change();
                        expect( ExportImportProjects.getAutoLoadLocal() ).toBe(true);
                        $('#autoSave').prop('checked', false);
                        $('#autoSave').change();
                        TestUtils.removeAppended();
                    }
                );
            }
        );
    }
);