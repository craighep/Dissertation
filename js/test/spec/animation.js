// Load the terrain module and describe tests.
define(
    [
        "../../animationController"
    ],
    function( animation ){
 
 
        // Describe the test suite for this module.
        describe(
            "Getting the pause and speed controls, setting options and checking animation works when user begins it",
            function(){
 
                // Check that terrain module creates a ground object, and returns it
                it(
                    "Should be paused by default",
                    function(){
                        expect( animation.getIsPaused() ).toBe(true);
                    }
                )
 
 
            }
        );
 
 
    }
);