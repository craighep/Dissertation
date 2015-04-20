// Load the json parser module and describe tests.
define(
    [
        "../../parseJson",
        "../../animationController",
        "test/spec/testUtils"
    ],
    function( ParseJson, AnimationController, TestUtils ){
 
 
        // Describe the test suite for this module.
        describe(
            "Tests the capabilities of converting from JSON to manoeuvre instructions",
            function(){
 
                // Check that manoeuvre instrcutions are not null
                it(
                    "Manouvres from JSON instructions should not be null",
                    function(){
                        ParseJson.init();
                        expect( ParseJson.getManoeuvreArray() ).not.toBe(null);
                    }
                );

                // There should be 27 OLAN manoeuvres
                it(
                    "Should be 27 OLAN manoeuvre objects in the JSON file",
                    function(){
                        ParseJson.init();
                        expect( ParseJson.getManoeuvreArray().length ).toBe(27);
                    }
                );

                // There should be 27 OLAN manoeuvres
                it(
                    "Should be 27 OLAN manoeuvre objects in the JSON file",
                    function(){
                        ParseJson.init();
                        expect( ParseJson.getManoeuvreArray().length ).toBe(27);
                    }
                );

                // JSON instructions should come from intpu.
                it(
                    "JSON instructions should come from entering OLAN",
                    function(){
                        TestUtils.setUpAppend("<input id='input'/>");

                        AnimationController.initControlEvents();
                        ParseJson.init();
                        $('#input').val('o');
                        $('#input').keyup();
                        expect( ParseJson.getManoeuvreArray().length ).toBe(27);
                        TestUtils.removeAppended();
                    }
                );
            }
        );
    }
);