// Load the json parser module and describe tests.
define(
    [
        "../../parseJson"
    ],
    function( parseJson ){
 
 
        // Describe the test suite for this module.
        describe(
            "Tests the capabilities of converting from JSON to manoeuvre instructions",
            function(){
 
                // Check that manoeuvre instrcutions are not null
                it(
                    "Manouvres from JSON instructions should not be null",
                    function(){
                        parseJson.init();
                        console.log(parseJson.getManoeuvreArray());
                        expect( parseJson.getManoeuvreArray() ).not.toBe(null);
                    }
                );
            }
        );
 
 
    }
);