// Load the animation module and describe tests.
define(
    [
        "../../animationController",
        "test/spec/testUtils"
    ],
    function( animation, TestUtils ){ 
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
                );

                // Check pause functionality works
                it(
                    "Should not be paused after clicking pause",
                    function(){
                        TestUtils.setUpAppend("<button id='pause'></button><input id='input'>");
                        $('#input').val("o");

                        animation.initControlEvents();
                        $('#pause').click();
                        expect( animation.getIsPaused() ).toBe(false);

                        TestUtils.removeAppended();
                    }
                );

                // check default speed
                it(
                    "Default speed of animation should be increments of 0.005",
                    function(){
                        expect( animation.getAnimationSpeed() ).toBe(0.005);
                    }
                );

                // Check changing speed of animation works
                it(
                    "Speed should be 0.01 at maximum value of slider",
                    function(){
                        TestUtils.setUpAppend("<input id='speed' type='range' value='0.01' min='0.001' max='0.01' step='0.001' />");

                        animation.initControlEvents();
                        $('#speed').change();
                        expect( animation.getAnimationSpeed() ).toBe(0.01);

                        TestUtils.removeAppended();
                    }
                );

                // check default scale
                it(
                    "Default scale should be 4",
                    function(){
                        expect( animation.getScale() ).toBe(4);
                    }
                );

                // Check changing scale of flights works
                it(
                    "The scale should be changable to 1",
                    function(){
                        TestUtils.setUpAppend("<select id='scale'><option>1</option>"+
                            "<option>2</option><option selected>4</option>"+
                            "<option>6</option><option>10</option></select>");

                        animation.initControlEvents();
                        $('#scale').val(1);
                        $('#scale').change();
                        expect( animation.getScale() ).toBe(1);

                        TestUtils.removeAppended();
                    }
                )
            }
        );
    }
);