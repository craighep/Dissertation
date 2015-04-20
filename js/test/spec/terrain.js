// Load the terrain module and describe tests.
define(
    [
        "../../terrain"
    ],
    function( terrain ){
 
 
        // Describe the test suite for this module.
        describe(
            "The terrain module creates and returns both ground and ligting for the scene.",
            function(){
 
                // Check that terrain module creates a ground object, and returns it
                it(
                    "Ground should not be null",
                    function(){
 
                        expect( terrain.createGround() ).not.toBe(null);
                    }
                );
 
                // Check that the lighting object is successfully created and returned
                it(
                    "Lighting should not be null",
                    function(){
 
                        expect( terrain.setupLight() ).not.toBe(null);
                    }
                );
 
 
            }
        );
 
 
    }
);