// Load the animation module and describe tests.
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

                // Check pause functionality works
                it(
                    "Should be not be paused after clicking pause",
                    function(){
                        var append = "";
                        append += "<button id='pause'></button><input id='input'/>";
                        $('body').append(append);
                        $('#input').val("o");

                        animation.initControlEvents();
                        $('#pause').click();
                        expect( animation.getIsPaused() ).toBe(false);
                        removeAppended(append);
                    }
                )

                // check default speed
                it(
                    "Default speed of animation should be increments of 0.005",
                    function(){
                        expect( animation.getAnimationSpeed() ).toBe(0.005);
                    }
                )

                // Check changing speed of animation works
                it(
                    "Speed should be 0.01 at maximum value of slider",
                    function(){
                        animation.initControlEvents();
                        $('#pause').click();
                        expect( animation.getIsPaused() ).toBe(false);
                    }
                )
            }
        );
 
        function removeAppended(append){
            var replaced = $("body").html().replace(append,'');
            $("body").html(replaced);
        }
    }
);