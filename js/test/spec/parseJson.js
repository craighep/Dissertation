// Load the terrain module and describe tests.
define(
    [
        "../../parseJson"
    ],
    function( parseJson ){
 
 
        // Describe the test suite for this module.
        describe(
            "Tests the capabilities of converting from JSON to manoeuvre instructions",
            function(){
 
                // Check that terrain module creates a ground object, and returns it
                it(
                    "Manouvres from JSON should not be null",
                    function(){
                        parseJson.init();
                        expect( parseJson.getManoeuvreArray() ).not.toBe(null);
                    }
                );
            }
        );
 
 
    }
);