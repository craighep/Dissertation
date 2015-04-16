// Load the terrain module and describe tests.
define(
    [
        "../../exportImportProjects"
    ],
    function( ExportImportProjects ){
 
 
        // Describe the test suite for this module.
        describe(
            "Importing and exporting scenarios to JSON and to localstorage. Tests for importing too.",
            function(){
 
                // Check that terrain module creates a ground object, and returns it
                it(
                    "Exporting to and then importing from localStorage should work",
                    function(){
                        ExportImportProjects.ExportImportProjects("o a b o");
                        expect( ExportImportProjects.importFromLocalStorage() ).toBe("o a b o");
                    }
                );
 
                // Should export manoeuvres to JSON from the scenario
                it(
                    "Lighting should not be null",
                    function(){
 
                        expect( ExportImportProjects.setupLight() ).not.toBe(null);
                    }
                );
 
 
            }
        );
 
 
    }
);